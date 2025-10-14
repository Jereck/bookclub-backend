import { type Context } from "hono";
import { create, getAll, getById, join, leave, remove, setBook, update } from "./bookclub.queries";

export const getAllBookclubs = async (c: Context) => {
  const allClubs = await getAll();
  return c.json(allClubs);
}

export const getBookclubById = async (c: Context) => {
  const id = c.req.param("id")
  const club = await getById(id)
  if (!club) return c.json({ error: "Not found" }, 404);
  return c.json(club);
}

export const createBookclub = async (c: Context) => {
  const data = await c.req.json();
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" });
  const newClub = await create(data, user.id);
  if (!newClub) return c.json({ message: "Error creating club" })
  return c.json({ message: "bookclub created", newClub }, 201);
}

export const updateBookclub = async (c: Context) => {
  const user = c.get("user");
  const id = c.req.param("id")
  const data = await c.req.json();
  const updatedBookclub = await update(user.id, id, data);
  if (!updatedBookclub) return c.json({ message: "Error updated bookclub" })
  return c.json(updatedBookclub)
}

export const deleteBookclub = async (c: Context) => {
  const id = c.req.param("id")
  const deletedBookclub = await remove(id);
  if (!deletedBookclub) return c.json({ message: "Error deleting bookclub" })
  return c.json({ message: "Deleted bookclub", deletedBookclub })
}

export const joinBookclub = async (c: Context) => {
  const bookclubId = c.req.param("id")

  const user = c.get("user");
  if (!user) return c.json({ message: "Not authorized" });

  const membership = await join(user.id, bookclubId);
  if (!membership) return c.json({ message: "Something went wrong joining bookclub" })

  return c.json(membership);
}

export const leaveBookclub = async (c: Context) => {
  const user = c.get("user");
  const bookclubId = c.req.param('id');

  if (!user) return c.json({ message: "Not authorized" });

  const leftMembership = await leave(user.id, bookclubId);
  return c.json({ message: "Bookclub left!", leftMembership })
}

export const setCurrentBook = async (c: Context) => {
  const user = c.get("user");
  const bookclubId = c.req.param("id");
  const { isbn, bookData } = await c.req.json();

  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  const updatedBookclub = await setBook(user.id, bookclubId, isbn, bookData);

  if (!updatedBookclub) return c.json({ message: "Something went wrong with updating current book" })

  return c.json({ message: "Current book set successfully", bookclub: updatedBookclub });
};