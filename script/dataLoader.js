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

export async function sendMessagesData(conversationId, senderId, content, timestamp) {
    const url = "../data/messages.json";
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: "1",
          senderId: 'value1',
          content: "Test d'envoie de message",
          timestamp: "2024-11-10T09:32:00Z",
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