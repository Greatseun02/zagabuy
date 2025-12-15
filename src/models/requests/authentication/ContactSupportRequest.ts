export type ContactSupportRequest = {
  contactEmail: string;
  contactMessage: string;
  contactSubject: string;
};

export const ContactSupportRequestInit: ContactSupportRequest = {
  contactEmail: "",
  contactMessage: "",
  contactSubject: "",
};
