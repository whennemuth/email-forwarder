export interface IContext {
  STACK_ID:       string;
  ACCOUNT:        string;
  REGION:         string;
  DOMAIN_NAME:    string;
  VERIFY_DOMAIN?: boolean;
  FROM_PREFIX:    string;
  EMAIL_MAPPINGS: EmailMapping[];
  TAGS:           Tags;
}

export interface EmailMapping {
  receivePrefix: string;
  targetEmails: string[];
}

export interface Tags {
  Service:   string;
  Function:  string;
  Landscape: string;
}