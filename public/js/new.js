// public/js/new.js:
document.querySelector('#new-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#post-title').value.trim();
    const content = document.querySelector('#post-content').value.trim();
  
    if (title && content) {
        console.log("Sending Post Data: ", JSON.stringify({ title, content }));
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to create post.');
      }
    }
  });
  