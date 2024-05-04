import db from "./db";
import { ContactIdentity } from "./interfaces";

export const reconcile = async (identity: ContactIdentity): Promise<Number> => {
  const phone_match_id: Number | null = identity.phoneNumber
    ? await db.matchPhone(identity.phoneNumber)
    : null;
  const email_match_id: Number | null = identity.email
    ? await db.matchEmail(identity.email)
    : null;

  var returnId: Number = 0;

  if (phone_match_id != null && email_match_id != null) {
    // Both Phone and Email are present.
    if (phone_match_id != email_match_id) {
      // They are present in two different groups.
      // Combine the groups, with smaller of the two ids as Group Id
      var grpId =
        phone_match_id < email_match_id ? phone_match_id : email_match_id;
      var secId =
        phone_match_id < email_match_id ? email_match_id : phone_match_id;

      await db.combineGroups(grpId, secId);
      returnId = grpId;
    } else {
      // They are present in the same group.
      // No action is required.
      returnId = phone_match_id;
    }
  } else if (phone_match_id != null) {
    // Only Phone is present. Create Secondary contact.
    await db.insertSecondary(identity, phone_match_id);
    returnId = phone_match_id;
  } else if (email_match_id != null) {
    // Only Email is present. Create Secondary contact.
    await db.insertSecondary(identity, email_match_id);
    returnId = email_match_id;
  } else {
    // Both phone and email are new. Create New Primary contact.
    const grpId = await db.insertPrimary(identity);
    returnId = grpId;
  }

  return returnId;
};
