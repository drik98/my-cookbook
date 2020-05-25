import React from "react"
import $ from "jquery";
import moment from "moment"

import Layout from "../components/layout"
import SEO from "../components/seo"
import RezeptForm from "../components/rezeptForm"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImport } from '@fortawesome/free-solid-svg-icons'

class Rezeptgenerator extends React.Component {

  constructor() {
    super()
    this.state = this.getInitialState()

    this.importRezept = this.importRezept.bind(this)
  }

  componentDidMount() {
    const urlInput = document.getElementById("url")
    $('#import-rezept-modal').on('hide.bs.modal', () => {
      let url = urlInput.value
      urlInput.value = ""
      if (url.trim() !== "") {
        this.importRezept(url)
      }
    })
  }

  /**
   * returns the object for the initial state of values once the page is loaded
   */
  getInitialState() {
    return {
      "name": "",
      "zeit": "",
      "schwierigkeit": 1,
      "portionen": "",
      "anweisungen": [{
        id: 1,
        value: ""
      }],
      "zutaten": [{
        id: 1,
        anzahl: "",
        name: ""
      }],
      "path": "/",
      "image": false,
      "anmerkungen": "",
      "quelle": "",
      "kategorien": [{
        id: 1,
        value: ""
      }]
    };
  }

  /**
   * takes a url referencing a receipt (e.g. from chefkoch) and loads the data into the form
   */
  importRezept(url) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com'
    if (!url.includes("chefkoch")) {
      return;
    }
    fetch(`${proxyUrl}/${url}`)
      .then(blob => blob.text())
      .then(data => {
        const fragment = document.createDocumentFragment()
        const div = fragment.appendChild(document.createElement("div"))
        div.innerHTML = data
        const recipe = Array.from(fragment.querySelectorAll(`script[type="application/ld+json"]`)).map(entry => JSON.parse(entry.innerText)).find(entry => entry["@type"] === "Recipe")
        const duration = moment.duration(recipe.totalTime)
        let state = {
          name: recipe.name,
          zeit: `${duration.hours()}:${duration.minutes()} H`,
          schwierigkeit: 1,
          portionen: parseInt(recipe.recipeYield),
          anweisungen: recipe.recipeInstructions.split("\n").filter(entry => entry.trim() !== "").map((entry, index) => ({ id: index + 1, anweisung: entry })),
          zutaten: recipe.recipeIngredient.map((entry, index) => {
            let split = entry.split(/\s+/)
            let amount = split.shift()
            let name = split.join(" ")
            return {
              anzahl: amount,
              name: name,
              id: index + 1
            }
          }),
          image: recipe.image,
          quelle: url
        }
        console.log(recipe)
        this.setState(oldState => {
          return { ...oldState, ...state }
        })
      })
  }

  render() {


    return (<Layout>
      <SEO title="Rezeptgenerator" />
      <section id="rezeptgenerator" className="main-content">
        <div className="container">
          <div className="row">
            <div className="col-9">
              <h2>Rezeptgenerator</h2>
            </div>
            <div className="col-3">
              <button
                data-toggle="modal"
                data-target="#import-rezept-modal"
                className="btn btn-secondary">
                <FontAwesomeIcon icon={faFileImport} /> Rezept importieren
              </button>
            </div>

          </div>
          <RezeptForm data={this.state} />
        </div>
      </section>
      {/* Modal */}
      <div className="modal fade" id="import-rezept-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Rezept importieren</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="name">URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="url"
                    name="url"
                    placeholder="https://..." />
                  <small id="urlHelp" className="form-text text-muted">Bisher wird nur chefkoch unterstützt</small>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal">Importieren</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    )
  }
}


export default Rezeptgenerator