import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Receipt from "../components/receipt"
import Categories from "../components/categories"

class IndexTemplate extends React.Component {

  componentDidMount() {
    if(this.props.pageContext.rezepte.length === 0) {
      document.getElementById("no-recipes").classList.remove("hidden");
    }
  }

  render() {
    const { pageContext } = this.props
    const { rezepte } = pageContext

    return (<Layout>
      <SEO title="Home" />
      <Categories />
      <section id="items">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2>Rezepte</h2>
            </div>
          </div>
          <div className="row">
            <span id="no-recipes" className="wow hidden">Kein Rezept vorhanden.</span>
            {rezepte.sort((receipt1,receipt2) => receipt1.name.localeCompare(receipt2.name)).map(data =>
              <Receipt key={data.name} data={data} />
            )}
          </div>
        </div>
      </section>
    </Layout>
    )
  }
}


export default IndexTemplate