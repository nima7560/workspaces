$(document).ready(function () {
    function showSuccess() {
      var modal = new bootstrap.Modal($('#successModal'));
      modal.show();
    }
  
    function resetForm(formId) {
      $(formId)[0].reset();
    }
  
    function clearEditForm() {
      $('#editLandForm')[0].reset();
      $('#editLandForm').addClass('d-none');
      $('#message').text('');
    }
  
    $('#listLandForm').on('submit', function (e) {
      e.preventDefault();
      const land = {
        id: $('#landId').val(),
        location: $('#location').val(),
        size: $('#size').val(),
        price: $('#price').val(),
      };
  
      $.ajax({
        url: '/lands',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(land),
        success: showSuccess,
        error: err => console.error(err),
        complete: () => resetForm('#listLandForm')
      });
    });
  
    $('#getLandForm').on('submit', function (e) {
      e.preventDefault();
      const id = $('#searchLandId').val();
      $.ajax({
        url: `/lands/${id}`,
        type: 'GET',
        success: data => {
          $('#editLandId').text(data.id);
          $('#editPrice').val(data.price);
          $('#editOwner').val('');
          $('#editLandForm').removeClass('d-none');
          $('#message').text('');
          // Show Buy button
          $('#buyButton').removeClass('d-none');
        },
        error: err => {
          clearEditForm();
          $('#message').text('Land not found');
        }
      });
    });
  
    $('#sellButton').click(function () {
      const id = $('#editLandId').text();
      const price = $('#editPrice').val();
      $.ajax({
        url: `/lands/${id}/sell`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ price }),
        success: showSuccess,
        error: err => console.error(err),
        complete: clearEditForm
      });
    });
  
    $('#transferButton').click(function () {
      const id = $('#editLandId').text();
      const newOwner = $('#editOwner').val();
      $.ajax({
        url: `/lands/${id}/transfer`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ newOwner }),
        success: showSuccess,
        error: err => console.error(err),
        complete: clearEditForm
      });
    });
  
    $('#deleteButton').click(function () {
      const id = $('#editLandId').text();
      $.ajax({
        url: `/lands/${id}`,
        type: 'DELETE',
        success: showSuccess,
        error: err => console.error(err),
        complete: clearEditForm
      });
    });
  
    // Add Buy button handler
    $('#buyButton').click(function () {
      const id = $('#editLandId').text();
      const user = $('#currentUser').val();
      $.ajax({
        url: `/lands/${id}/buy`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ user }),
        success: showSuccess,
        error: err => console.error(err),
        complete: clearEditForm
      });
    });
  
    $('#noButton').click(() => $('#confirmModal').modal('hide'));
  
    // Track user change (optional: can be used for logging or future use)
    $('#currentUser').change(function () {
      const user = $(this).val();
      // Optionally, store or use the user value
      // e.g., localStorage.setItem('currentUser', user);
    });
  });
