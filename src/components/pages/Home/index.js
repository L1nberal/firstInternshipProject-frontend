import { useEffect } from "react"

function Home() {

    // useEffect(() => {
    //     fetch('http://localhost:1337/api/apps?populate=photos')
    //     .then(response => response.json())
    //     .then(data => {
    //         Object.values(data)[0].map(app => {
    //             console.log(app.attributes.photos.data[0].attributes.url)
    //             const div = document.getElementById('div')
    //             div.innerHTML = `<img src='http://localhost:1337${app.attributes.photos.data[0].attributes.url}'/>`
    //         })
            
    //     })
    // }, [])

    return(
        <div id='div'>
            
        </div>
    )
}

export default Home
