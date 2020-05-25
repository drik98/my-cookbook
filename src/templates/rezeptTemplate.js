import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "../components/image"
import { Link } from "gatsby"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faChartArea, faUsers, faStar, faBackward } from '@fortawesome/free-solid-svg-icons'

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
            <div className="col-12 row">

              <div className="col-md-8 pull-left wow swing">
                <Image imgsrc={rezept.image} alt={rezept.name} className="recipe-picture" />
              </div>

              <div className="col-md-4 pull-right wow lightSpeedIn">
                <div className="recipe-info">
                  <h3>Info</h3>

                  <div className="row">
                    <div className="col-2 text-center">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="col-6">Zeit</div>
                    <div className="col-4">{rezept.zeit}</div>
                  </div>

                  <div className="row">
                    <div className="col-2 text-center">
                      <FontAwesomeIcon icon={faChartArea} />
                    </div>
                    <div className="col-6">Schwierigkeit</div>
                    <div className="col-4">
                      {new Array(5).fill(<></>).map((entry, index) => <FontAwesomeIcon icon={faStar} opacity={index + 1 > rezept.schwierigkeit ? 0.2 : 1} />)}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-2 text-center">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className="col-6">Portionen</div>
                    <div className="col-4">{rezept.portionen}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row wow  ">
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

          <div className="row wow slideInUp">
            <div className="col-12">
              <div className="recipe-notes">
                <h3>Anmerkungen</h3>
                <p>{rezept.anmerkungen ? rezept.anmerkungen : "Keine Anmerkungen."}</p>
                {rezept.quelle
                  ? (rezept.quelle.startsWith("http") ? (<span>Quelle: <a href={rezept.quelle}>{rezept.quelle}</a></span>) : <span>Quelle: {rezept.quelle}</span>) 
                  : <></>}
              </div>
            </div>
          </div>

          <div className="row wow rollIn">
            <div className="col-12 text-center">
              <Link to="/">
                <FontAwesomeIcon icon={faBackward} /> Go to back to recipes.
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
export default RezeptTemplate