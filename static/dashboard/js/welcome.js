window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

const startAnimation = (entries, observer) => {
    entries.forEach(entry => {
        entry.target.classList.toggle("animate", entry.isIntersecting);
    });
  };
  
  const observer = new IntersectionObserver(startAnimation);
  const options = {root: null, rootMargin: '0px', threshold: 1 }; 
  
  const elements = document.querySelectorAll('.text-animate');
  elements.forEach(el => {
    observer.observe(el, options);
  });


  $(".text-animate").attrchange({
    trackValues: false,
    callback: function (event) { 
        observer.unobserve($(this)[0])
    }        
});