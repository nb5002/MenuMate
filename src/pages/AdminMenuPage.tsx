import { useEffect, useState } from "react";
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../api/menuApi";
import type { MenuItem } from "../types";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "",
  category: "",
  price: 0,
  description: "",
  imageUrl: "",
  isAvailable: true,
};

type FormErrors = Partial<Record<"name" | "category" | "price" | "description", string>>;

// Label with a red asterisk for required fields
function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: 13, color: "#bbb", marginBottom: 4 }}>
      {text}
      {required && <span style={{ color: "#ff6b6b" }}> *</span>}
    </label>
  );
}

// Small red message shown under a field
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p style={{ color: "#ff6b6b", fontSize: 12, margin: "0 0 10px" }}>{message}</p>;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const { username, logout } = useAuth();

  const loadItems = async () => {
    setLoading(true);
    const response = await getAllMenuItems();
    setItems(response.data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (field: keyof typeof form, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear this field's error as soon as the admin starts typing in it
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof FormErrors];
      return next;
    });
  };

  // Checks each required field and returns true only if everything is valid
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!form.category.trim()) {
      newErrors.category = "Category is required.";
    }
    if (!form.price) {
      newErrors.price = "Price is required.";
    } else if (form.price < 0) {
      newErrors.price = "Price must be greater than 0.";
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setMessage("");

    // Stop here if any field is invalid: no API call, no generic error
    if (!validate()) return;

    try {
      if (editingId !== null) {
        await updateMenuItem(editingId, form);
        setMessage("Item updated successfully.");
      } else {
        await createMenuItem(form);
        setMessage("Item added successfully.");
      }
      setForm(emptyForm);
      setErrors({});
      setEditingId(null);
      loadItems();
    } catch (err) {
      setMessage("Failed to save item.");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setErrors({});
    setMessage("");
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setErrors({});
    setForm(emptyForm);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteMenuItem(id);
      setMessage("Item deleted.");
      loadItems();
    } catch (err) {
      setMessage("Failed to delete item.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #444",
    background: "#1a1a1a",
    color: "#fff",
    marginBottom: 10,
    boxSizing: "border-box" as const,
  };

  // Same as inputStyle, but with a red border and less bottom margin when the field has an error
  const fieldStyle = (field: keyof FormErrors) =>
    errors[field]
      ? { ...inputStyle, border: "1px solid #ff6b6b", marginBottom: 4 }
      : inputStyle;

  return (
    <div style={{ minHeight: "100vh", background: "#121212", padding: 24, color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Admin Panel — Menu Management</h1>
        <div>
          <span style={{ marginRight: 12 }}>Logged in as <strong>{username}</strong> (admin)</span>
          <button onClick={logout} style={{ padding: "6px 12px", cursor: "pointer" }}>Log Out</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Form */}
        <div style={{ background: "#1e1e1e", padding: 20, borderRadius: 8, width: 320 }}>
          <h3>{editingId !== null ? "Edit Item" : "Add New Item"}</h3>

          <Label text="Name" required />
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={fieldStyle("name")}
          />
          <FieldError message={errors.name} />

          <Label text="Category" required />
          <input
            placeholder="Category (e.g. Meals, Drinks, Desserts)"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            style={fieldStyle("category")}
          />
          <FieldError message={errors.category} />

          <Label text="Price" required />
          <input
            placeholder="Price"
            type="number"
            value={form.price === 0 ? "" : form.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            style={fieldStyle("price")}
          />
          <FieldError message={errors.price} />

          <Label text="Description" required />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            style={{ ...fieldStyle("description"), minHeight: 70 }}
          />
          <FieldError message={errors.description} />

          <Label text="Image URL (optional)" />
          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            style={inputStyle}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => handleChange("isAvailable", e.target.checked)}
            />
            Available
          </label>

          <button
            onClick={handleSubmit}
            style={{ width: "100%", padding: 10, background: "#4f7fff", border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            {editingId !== null ? "Save Changes" : "Add Item"}
          </button>

          {editingId !== null && (
            <button
              onClick={handleCancelEdit}
              style={{ width: "100%", padding: 10, marginTop: 8, background: "#333", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}

          {message && <p style={{ marginTop: 12, color: message.includes("success") || message.includes("deleted") || message.includes("updated") ? "#4ade80" : "#ff6b6b" }}>{message}</p>}
        </div>

        {/* List */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <p>Loading items...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {items.map((item) => (
                <div key={item.id} style={{ background: "#1e1e1e", borderRadius: 8, padding: 16 }}>
                  <h3 style={{ margin: "0 0 6px" }}>{item.name}</h3>
                  <p style={{ margin: "0 0 4px", color: "#888", fontSize: 13 }}>{item.category}</p>
                  <p style={{ margin: "0 0 6px", color: "#4f7fff", fontWeight: 600 }}>₱{item.price}</p>
                  <p style={{ margin: "0 0 8px", fontSize: 13, color: item.isAvailable ? "#4ade80" : "#ff6b6b" }}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleEdit(item)} style={{ flex: 1, padding: 6, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: 6, cursor: "pointer", background: "#ff6b6b", border: "none", borderRadius: 4, color: "#fff" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}