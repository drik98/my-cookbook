import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "../components/image"
import { Link } from "gatsby"

import "../components/css/font-awesome.min.css"

const RezeptTemplate = props => {
  const { pageContext } = props
  const { rezept } = pageContext

  return (
    <Layout>
      <SEO title={rezept.name} />
      <section id="recipe">
        <div className="container">
          <div className="row">

            <div className="col-12">
              <h2>{rezept.name}</h2>
            </div>
          </div>
          <div className="row vertical-align">
            <div className="col-12">

              <div className="col-md-8 pull-left wow swing">
                <Image imgsrc={rezept.image} alt={rezept.name} className="recipe-picture" />
              </div>

              <div className="col-md-4 pull-right wow lightSpeedIn">
                <div className="recipe-info">
                  <h3>Info</h3>

                  <div className="row">
                    <div className="col-2 text-center">
                      <i className="fa fa-clock-o" aria-hidden="true"></i>
                    </div>
                    <div className="col-6">Zeit</div>
                    <div className="col-4">{rezept.zeit}</div>
                  </div>

                  <div className="row">
                    <div className="col-2 text-center">
                      <i className="fa fa-area-chart" aria-hidden="true"></i>
                    </div>
                    <div className="col-6">Schwierigkeit</div>
                    <div className="col-4">
                      {new Array(5).fill(<></>).map((entry, index) => index + 1 > rezept.schwierigkeit ? <i className="fa fa-star-o" aria-hidden="true"></i> : <i className="fa fa-star" aria-hidden="true"></i>)}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-2 text-center">
                      <i className="fa fa-users" aria-hidden="true"></i>
                    </div>
                    <div className="col-6">Portionen</div>
                    <div className="col-4">{rezept.portionen}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row wow slideInUp">
            <div className="col-12">
              <div className="recipe-ingredients">
                <h3>Zutaten</h3>
                <dl className="ingredients-list">
                  {rezept?.zutaten?.map(zutat => (<><dt>{zutat.anzahl}</dt><dd>{zutat.name}</dd></>))}
                </dl>
              </div>
            </div>
          </div>

          <div className="row wow slideInUp">
            <div className="col-12">
              <div className="recipe-directions">
                <h3>Anweisungen</h3>
                <ol>
                  {rezept?.anweisungen?.map((anweisung, index) => (<li key={`anweisung_${index}`}>{anweisung}</li>))}
                </ol>
              </div>
            </div>
          </div>

          <div className="row wow rollIn">
            <div className="col-12 text-center">
              <Link to="/">
                <i className="fa fa-backward" aria-hidden="true"></i> Go to back to recipes.
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
export default RezeptTemplate