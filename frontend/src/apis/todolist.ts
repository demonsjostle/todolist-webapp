const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET!;

export async function createTodolist(date: string, user: string) {
  const mutation = `
  mutation CreateTodolist($date: date!, $user: String!, $taskData: [jsonb!]!) {
    insert_todolist_one(object: { date: $date, user: $user, taskData: $taskData }) {
      id
      user
      date,
      taskData
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
      variables: { date, user, taskData: [] },
    }),
  });

  const result = await response.json();
  return result.data?.insert_todolist_one || null;
}

export async function updateTodolist(id: number, taskData: []) {
  const mutation = `
    mutation UpdateTodolist($id: bigint!, $taskData: [jsonb!]!) {
      update_todolist_by_pk(pk_columns: { id: $id }, _set: { taskData: $taskData }) {
        id
        date
        taskData
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
      variables: { id, taskData: taskData },
    }),
  });

  const result = await response.json();
  return result.data?.update_todolist_by_pk || null;
}

export async function deleteTodolist(id: number) {
  const mutation = `
    mutation DeleteTodolist($id: bigint!) {
      delete_todolist_by_pk(id: $id) {
        id
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
      variables: { id },
    }),
  });

  const result = await response.json();
  return result.data?.delete_todolist_by_pk || null;
}

export async function getTodolistByDate(date: string, user: string) {
  const query = `
    query GetTodolistByDateAndUser($date: date!, $user: String!) {
      todolist(where: { date: { _eq: $date }, user: { _eq: $user } }) {
        id
        date
        taskData
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
      query,
      variables: { date, user },
    }),
  });

  const result = await response.json();
  return result.data?.todolist[0] || null;
}
