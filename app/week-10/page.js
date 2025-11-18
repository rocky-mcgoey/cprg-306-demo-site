"use client";
import { useState, useEffect } from "react";
import {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} from "@/app/lib/controller";

export default function Page() {
  // create data input field state
  const [inputValue, setInputValue] = useState("");
  // edit id state
  const [editId, setEditId] = useState(null);
  // data state TO BE OPTIMIZED
  const [items, setItems] = useState("");

  // handle create entry
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    try {
      if (editId) {
        console.log(`updating item: ${editId} with ${inputValue}`);
        await updateItem(editId, "users", inputValue);
        setEditId(null);
      } else {
        console.log(`Adding new item: ${inputValue}`);
        await addItem("users", inputValue);
      }
      setInputValue("");
      getItems("users");
    } catch (error) {
      console.error(`Error adding ${inputValue}`, error);
    }
  };
  // handle edit entry
  const handleEdit = (item) => {
    setInputValue(item.name);
    setEditId(item.id);
  };
  const handleCancel = () => {
    setEditId(null);
    setInputValue("");
  };
  // handle delete entry
  const handleDelete = async (id) => {
    try {
      await deleteItem(id, "users");
    } catch (error) {
      console.error(`Error Deleting ${id}`);
    }
  };
  // fetch all data from the db
  const fetchItems = async () => {
    try {
      const data = await getItems("users");
      setItems(data);
    } catch (error) {
      console.error(`Error fetching items from users`, error);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);
  console.log(items);
  return (
    <main>
      <header>
        <h1 className="text-4xl">Next + Firestore CRUD</h1>
      </header>
      {/* // section to show all the content in the collection  */}
      <section className="my-4">
        <h2 className="text-2xl">List of Data Items</h2>
        <ul>
          {items.length > 0 ? (
            items.map((character) => (
              <li key={character.id} className="my-4 flex gap-6">
                <h3 className="text-lg font-medium">{character.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(character)}
                    className="px-4 py-2 m-2 rounded-md bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(character.id)}
                    className="px-4 py-2 m-2 rounded-md bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>Loading</p>
          )}
        </ul>
      </section>
      <section>
        <label htmlFor="input-name">{editId ? "Edit User" : "Add User"}</label>
        <input
          type="text"
          id="input-name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="border-1 mx-2  p-2"
        />
        <button
          onClick={() => handleSubmit()}
          className={`px-4 py-2 m-2 rounded-md ${
            editId ? "bg-yellow-700" : "bg-blue-700"
          }`}
        >
          {editId ? "Edit" : "Add"}
        </button>
        {editId && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 m-2 rounded-md bg-orange-700"
          >
            Cancel Edit
          </button>
        )}
      </section>
    </main>
  );
}
