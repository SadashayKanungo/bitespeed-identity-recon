export interface ContactIdentity {
  phoneNumber?: number;
  email?: string;
}

export interface MatchResult {
  result: number;
}

export interface ContactGroup {
  contact: {
    primaryContatctId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export interface AggStrResult {
  result: string;
}

export interface AggNumResult {
  result: number;
}
