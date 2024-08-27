(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

const taxBoxToggle = document.querySelector("#flexSwitchCheckDefault");
const texInfo = document.querySelectorAll(".tex-info");
taxBoxToggle.addEventListener("click", ()=>{
  // console.log(texInfo);
  for(info of texInfo){
    if(info.style.display == "inline"){
      info.style.display = "none";
    }else{
      info.style.display = "inline";
    }
  }
   

})




 


 