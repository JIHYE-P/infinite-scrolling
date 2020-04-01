const POST_NUMBER = 10
const container = document.querySelector('.infinite-container')
let currentLastContent = null

const createContents = random => {
  const contents = []
  for(let i=0; i<POST_NUMBER; i++){
    const li = document.createElement('li')
    const img = new Image()
    img.dataset.lazy = `https://source.unsplash.com/featured/1000x600/?daily${Math.floor(Math.random()*random)}`
    img.src = './cover.svg'
    li.appendChild(img)
    contents.push(li)
  }
  return contents
}

if('IntersectionObserver' in window) {
  const loadingContents = (newContents) => {
    const loading = Object.assign(document.createElement('li'), {innerText: '...loading'})
    container.appendChild(loading)

    return new Promise(res => {
      setTimeout(() => {
        res(newContents)
        container.removeChild(loading)
      }, 1000)
    })
  }

  const infiniteScrolling = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return
      const {target} = entry
      const newContents = createContents(10)
      loadingContents(newContents).then(contents => {
        loopContents(contents)
        currentLastContent = container.lastChild
        observer.unobserve(target)
        observer.observe(currentLastContent)
      })
    })
  })

  const lazyImages = new IntersectionObserver((entries, observe) => {
    entries.forEach(entry => {
      const {target} = entry
      if(!entry.isIntersecting) return
      const img = target.childNodes[0]
      img.src = img.dataset.lazy
      lazyImages.unobserve(img)
    })
  })

  const loopContents = contents => {
    contents.forEach(content => {
      container.appendChild(content)
      lazyImages.observe(content)
    })
  }

  loopContents(createContents(20))
  infiniteScrolling.observe(container.lastChild)

}