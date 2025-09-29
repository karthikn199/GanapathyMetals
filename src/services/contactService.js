const API_BASE_URL = "http://localhost:4000/api/contacts";

export const getContacts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // First check the content type
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch contacts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getContacts:", error);
    throw new Error(`Failed to fetch contacts: ${error.message}`);
  }
};

export const createContact = async (contactData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: contactData.name,
        phone_number: contactData.phone,
        email: contactData.email,
        tags: contactData.tags.join(", "),
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create contact");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

export const updateContact = async (id, contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: contactData.name,
        phone_number: contactData.phone,
        email: contactData.email,
        tags: contactData.tags.join(", "),
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to update contact");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }
    return true;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};

export const bulkDeleteContacts = async (ids) => {
  try {
    // Note: You'll need to implement a bulk delete endpoint in your API
    // This is a placeholder implementation
    const deletePromises = ids.map((id) => deleteContact(id));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Error bulk deleting contacts:", error);
    throw error;
  }
};

export const bulkUploadContacts = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/bulk-upload`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - browser will set it automatically with boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload contacts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading contacts:", error);
    throw error;
  }
};

// services/contactService.js

export const getContactGroups = async () => {
  const response = await fetch("/api/contact-groups");
  if (!response.ok) throw new Error("Failed to fetch contact groups");
  return await response.json();
};

export const getGroupContacts = async (groupId) => {
  const response = await fetch(`/api/contact-groups/${groupId}/contacts`);
  if (!response.ok) throw new Error("Failed to fetch group contacts");
  return await response.json();
};
