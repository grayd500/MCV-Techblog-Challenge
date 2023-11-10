// public/js/comment.js:
console.log('comment.js loaded');
document.addEventListener('DOMContentLoaded', function() {
  const commentForm = document.getElementById('comment-form');

  if (commentForm) {
    commentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      console.log('Submitting comment at:', new Date().toISOString()); // Add this line for debugging
      const commentText = commentForm.querySelector('textarea[name="comment"]').value;
      const postId = window.location.pathname.split('/').pop();

      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ postId, text: commentText }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        location.reload(); // Reload the page to show the new comment
      } else {
        alert('Failed to post comment');
      }
    });
  }
});

