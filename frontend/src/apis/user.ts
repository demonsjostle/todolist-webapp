const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET!;

// 🔹 สมัครสมาชิก (Register)
export async function registerUser(
  username: string,
  password: string,
  name: string,
  surname: string,
) {
  const mutation = `
    mutation Register($username: String!, $password: String!, $name: String!, $surname: String!) {
      insert_user_one(object: { username: $username, password: $password, name: $name, surname: $surname }) {
        id
        username
      }
    }
  `;

  const response = await fetch(HASURA_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { username, password, name, surname }, // ตรวจสอบการส่งตัวแปรทั้งหมด
    }),
  });

  const result = await response.json();
  if (result.errors) {
    console.error(result.errors); // แสดง error ในกรณีที่เกิดข้อผิดพลาด
    return { success: false, message: "Registration failed." };
  }

  return result.data?.insert_user_one || null;
}

// 🔹 เข้าสู่ระบบ (Login) (ตรวจสอบ username และ password ตรงกันหรือไม่)
export async function loginUser(username: string, password: string) {
  console.log(HASURA_GRAPHQL_URL);
  const query = `
    query Login($username: String!) {
      user(where: { username: { _eq: $username } }) {
        id
        username
        password
        name
        surname
      }
    }
  `;

  const response = await fetch(HASURA_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  const result = await response.json();
  const user = result.data?.user[0];

  if (!user || user.password !== password) {
    return { success: false, message: "Invalid username or password" };
  }

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      surname: user.surname,
    },
  };
}

// 🔹 ดึงข้อมูล User Profile โดยใช้ ID หรือ Username
export async function getUserProfile(username: string) {
  const query = `
    query Profile($username: String!) {
      user(where: { username: { _eq: $username } }) {
        id
        name
        surname
        username
      }
    }
  `;

  const response = await fetch(HASURA_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  const result = await response.json();
  return result.data?.user[0] || null;
}
