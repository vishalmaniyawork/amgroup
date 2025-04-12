$("#contact-form-data").on("submit", function (e) {
  e.preventDefault()
  $(".contact_btn i").removeClass("d-none")

  const $form = $(this)
  let proceed = true

  $form.find("input[name]:not([type=hidden]), textarea").each(function () {
    if (!$(this).val()) proceed = false
  })

  if (proceed) {
    const formData = $form.serialize() // Important: This creates application/x-www-form-urlencoded format

    $.ajax({
      url: "/", // Netlify expects it to go to the same page
      method: "POST",
      data: formData,
      success: function () {
        const successMsg =
          '<div class="alert-success" style="padding:10px 15px; margin-bottom:30px;">Thank you! Your message has been sent.</div>'
        showResult(successMsg, "success")
        $form[0].reset()
        $(".contact_btn i").addClass("d-none")
      },
      error: function () {
        const errorMsg =
          '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">There was a problem submitting your form. Please try again later.</div>'
        showResult(errorMsg, "error")
        $(".contact_btn i").addClass("d-none")
      },
    })
  } else {
    const errorMsg =
      '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">Please provide the missing fields.</div>'
    showResult(errorMsg, "error")
    $(".contact_btn i").addClass("d-none")
  }

  function showResult(msg, type) {
    if ($("#result").length) {
      $("#result").hide().html(msg).slideDown()
    } else {
      Swal.fire({
        icon: type,
        title: type === "success" ? "Success!" : "Oops...",
        html: msg,
      })
    }
  }
})

//modal window form

$(".modal_contact_btn").on("click", function () {
  //disable submit button on click
  // $(".modal_contact_btn").attr("disabled", "disabled");
  // $(".modal_contact_btn b").text('Sending');
  $(".modal_contact_btn i").removeClass("d-none")

  //simple validation at client's end
  var post_data, output
  var proceed = "true"

  var str = $("#modal-contact-form-data").serializeArray()

  $("#modal-contact-form-data input").each(function () {
    if (!$(this).val()) {
      proceed = "false"
    }
  })

  //everything looks good! proceed...
  if (proceed === "true") {
    var pathArray = window.location.pathname.split("/")
    var secondLevelLocation = pathArray[3]

    var accessURL
    if (secondLevelLocation) {
      accessURL = "../vendor/contact-mailer.php"
    } else {
      accessURL = "vendor/contact-mailer.php"
    }
    //data to be sent to server
    $.ajax({
      type: "POST",
      // url : 'vendor/contact-mailer.php',
      url: accessURL,
      data: str,
      dataType: "json",
      success: function (response) {
        if (response.type == "error") {
          output =
            '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">' +
            response.text +
            "</div>"
        } else {
          output =
            '<div class="alert-success" style="padding:10px 15px; margin-bottom:30px;">' +
            response.text +
            "</div>"
          //reset values in all input fields
          $(".contact-form input").val("")
          $(".contact-form textarea").val("")
        }

        if ($("#quote_result").length) {
          $("#quote_result").hide().html(output).slideDown()
          $(".modal_contact_btn i").addClass("d-none")
        } else {
          if (response.type == "error") {
            Swal.fire({
              type: "error",
              icon: "error",
              title: "Oops...",
              html: '<div class="text-danger">' + response.text + "</div>",
            })
            $(".modal_contact_btn i").addClass("d-none")
          } else {
            Swal.fire({
              type: "success",
              icon: "success",
              title: "Success!",
              html: '<div class="text-success">' + response.text + "</div>",
            })
            $(".modal_contact_btn i").addClass("d-none")
          }
        }
        // $("#quote_result").hide().html(output).slideDown();
        // $(".modal_contact_btn i").addClass('d-none');
      },
      error: function () {
        alert("Failer")
      },
    })
  } else {
    // output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">Please provide the missing fields.</div>';
    // $("#quote_result").hide().html(output).slideDown();
    // $(".modal_contact_btn i").addClass('d-none');
    if ($("#quote_result").length) {
      // alert("yes");
      output =
        '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">Please provide the missing fields.</div>'
      $("#quote_result").hide().html(output).slideDown()
      $(".modal_contact_btn i").addClass("d-none")
    } else {
      Swal.fire({
        icon: "error",
        type: "error",
        title: "Oops...",
        html: '<div class="text-danger">Please provide the missing fields.</div>',
      })
      $(".modal_contact_btn i").addClass("d-none")
    }
  }
})
