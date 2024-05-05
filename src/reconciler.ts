import db from "./db";
import { ContactIdentity } from "./interfaces";

export const reconcile = async (identity: ContactIdentity): Promise<number> => {
  // Match id > 0 : Match found, Match id = Group Id
  // Match id = 0 : No match
  // Match id = -1 : Phone/Email value is null
  // Total 3*3 cases possible

  const phone_match_id: number = identity.phoneNumber
    ? await db.matchPhone(identity.phoneNumber)
    : -1;
  const email_match_id: number = identity.email
    ? await db.matchEmail(identity.email)
    : -1;

  var returnId: number = 0;

  if (phone_match_id > 0 && email_match_id > 0) {
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
  } else if (phone_match_id > 0 && email_match_id == 0) {
    // Phone is present but Email is new. Create Secondary contact.
    await db.insertSecondary(identity, phone_match_id);
    returnId = phone_match_id;
  } else if (phone_match_id > 0 && email_match_id == -1) {
    // Phone is already present and Email is null. No action required.
    returnId = phone_match_id;
  } else if (phone_match_id == 0 && email_match_id > 0) {
    // Email is present but Phone is new. Create Secondary contact.
    await db.insertSecondary(identity, email_match_id);
    returnId = email_match_id;
  } else if (phone_match_id == 0 && email_match_id == 0) {
    // Both phone and email are new. Create New Primary contact.
    const grpId = await db.insertPrimary(identity);
    returnId = grpId;
  } else if (phone_match_id == 0 && email_match_id == -1) {
    // Phone is new and Email is null. Create New Primary contact.
    const grpId = await db.insertPrimary(identity);
    returnId = grpId;
  } else if (phone_match_id == -1 && email_match_id > 0) {
    // Phone is Null and Email is present. No action required.
    returnId = email_match_id;
  } else if (phone_match_id == -1 && email_match_id == 0) {
    // Phone is null and Email is new. Create New Primary contact.
    const grpId = await db.insertPrimary(identity);
    returnId = grpId;
  } else if (phone_match_id == -1 && email_match_id == -1) {
    // Both Phone and Email are Null. Invalid input. No action required.
    returnId = -1;
  }

  return returnId;
};
