import { pool } from "../../config/db";
import { AppError } from "../../middleware/errorHandler";
import type { UserResponse } from "../../types/typeDefine";

const getAllUsers = async (): Promise<UserResponse[]> => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users ORDER BY id DESC"
  );
  return result.rows;
};

const getUserById = async (id: number): Promise<UserResponse> => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, "User not found");
  }

  return result.rows[0];
};

const updateUser = async (
  id: number,
  updateData: any
): Promise<UserResponse> => {
  // Verify user exists
  await getUserById(id);

  const { name, phone, role } = updateData;

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    values.push(name);
  }

  if (phone !== undefined) {
    updates.push(`phone = $${paramCount++}`);
    values.push(phone);
  }

  if (role !== undefined) {
    if (role !== "admin" && role !== "customer") {
      throw new AppError(400, "Invalid role. Must be 'admin' or 'customer'");
    }
    updates.push(`role = $${paramCount++}`);
    values.push(role);
  }

  if (updates.length === 0) {
    return await getUserById(id);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `UPDATE users SET ${updates.join(
    ", "
  )} WHERE id = $${paramCount} RETURNING id, name, email, phone, role`;

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteUser = async (id: number): Promise<void> => {
  // Verify user exists
  await getUserById(id);

  // Check for active bookings
  const bookingCheck = await pool.query(
    "SELECT COUNT(*) FROM bookings WHERE customer_id = $1 AND status = 'active'",
    [id]
  );

  if (parseInt(bookingCheck.rows[0].count) > 0) {
    throw new AppError(400, "Cannot delete user with active bookings");
  }

  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
