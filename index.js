typeof document !== 'undefined' && document.addEventListener('DOMContentLoaded', () => {
  const POST_NUMBER = 10
  const container = document.querySelector('.infinite-container')
  let currentLastContent = null

  const createContents = (random) => {
    const contents = []
    for(let i=0; i<POST_NUMBER; i++){
      const img = new Image()
      const li = document.createElement('li')
      img.src = './cover.svg'
      img.dataset.lazy = `https://source.unsplash.com/featured/1000x600/?daily${Math.floor(Math.random()*random)}`
      li.appendChild(img)
      contents.push(li)
    }
    return contents;
  }
  
  const loadingContents = (contents) => {
    const loading = Object.assign(document.createElement('li'), {innerText: '...loading'})
    return new Promise((resolve, reject) => {
      container.appendChild(loading)
      setTimeout(() => {
        resolve(contents)
        container.removeChild(loading)
      }, 1000)
    })  
  }

  if('IntersectionObserver' in window) {
    const lazyImages = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const {target} = entry
        if(!entry.isIntersecting) return
        const img = target.childNodes[0]
        img.src = img.dataset.lazy
        lazyImages.unobserve(img)
      })
    })

    const infiniteScrolling = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const {target} = entry
        if(!entry.isIntersecting) return
        loadingContents(createContents(50)).then(newContents => {
          newContents.forEach(newContent => {
            container.appendChild(newContent);
            lazyImages.observe(newContent)
          })
          currentLastContent = container.lastChild
          observer.unobserve(target);
          observer.observe(currentLastContent);
        });      
      })
    }, {root: null, threshold: 1})

    const contents = createContents(10)
    contents.forEach(content => {
      container.appendChild(content)
      lazyImages.observe(content)
    })
    infiniteScrolling.observe(container.lastChild)
  }
})