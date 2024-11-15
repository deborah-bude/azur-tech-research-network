export async function getPostsData() {
    const url = "/data/posts.json";
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
    const url = "/data/users.json";
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
    const url = "/data/messages.json";
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

export async function postMessagesData(conversationId, friendId, content, timestamp) {
  const url = "/data/messages.json";
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: conversationId,
        friendId: friendId,
        senderId: 0,
        content: content,
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement du message");
    }
    return response.json();
  } catch (error) {
    console.error(error.message);
  }
}