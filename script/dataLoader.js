export async function getPostsData() {
    const url = "../data/posts.json";
    try {
      const response = await fetch(url, {method: "GET"});
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return (json);
    } catch (error) {
      console.error(error.message);
    }
}

export async function getUsersData() {
    const url = "../data/users.json";
    try {
      const response = await fetch(url, {method: "GET"});
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return (json);
    } catch (error) {
      console.error(error.message);
    }
}