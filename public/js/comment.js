// public/js/comment.js:
document.addEventListener('DOMContentLoaded', function() {
  const commentForm = document.getElementById('comment-form');

  if (commentForm) { // Added a check to make sure the comment form exists
    commentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const commentText = commentForm.querySelector('textarea[name="comment"]').value;
      const postId = window.location.pathname.split('/').pop(); // Correct as per your URL assumption

      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ 
          postId,  // This is correct
          text: commentText  // Change 'commentText' to 'text' to match the Comment model
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        location.reload(); // Reload the page to show the new comment
      } else {
        alert('Failed to post comment');
      }
    });
  }
});
