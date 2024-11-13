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

export async function getMessagesData() {
    const url = "../data/messages.json";
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

export async function sendMessagesData(conversationId, friendId, content, timestamp) {
    const url = "https://azur-tech-research-network.vercel.app/data/messages.json";
    console.log(conversationId, friendId, content, timestamp)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "conversationId": conversationId,
          "friendId": friendId,
          "messages": [ 
            {
              "senderId": 0, 
              "content": content, 
              "timestamp": timestamp
            }
          ],
        })
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return (json);
    } catch (error) {
      console.error(error.message);
    }
}