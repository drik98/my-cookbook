import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faPlus } from '@fortawesome/free-solid-svg-icons'
import placeholder from "../images/receipt-image-placeholder.jpg"

class RezeptForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.data

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.download = this.download.bind(this);
        this.generatePath = this.generatePath.bind(this)
        this.handleImageSelect = this.handleImageSelect.bind(this)
        this.handleChangeMultiple = this.handleChangeMultiple.bind(this)

        this.addZutat = this.addZutat.bind(this);
        this.addNewZutat = this.addNewZutat.bind(this);
        this.handleKeyZutat = this.handleKeyZutat.bind(this);
        this.handlePasteZutat = this.handlePasteZutat.bind(this);

        this.addKategorie = this.addKategorie.bind(this);
        this.addNewKategorie = this.addNewKategorie.bind(this);
        this.handleKeyKategorie = this.handleKeyKategorie.bind(this);

        this.addAnweisung = this.addAnweisung.bind(this);
        this.addNewAnweisung = this.addNewAnweisung.bind(this);
        this.handleKeyAnweisung = this.handleKeyAnweisung.bind(this);
        this.handlePasteAnweisung = this.handlePasteAnweisung.bind(this);
        this.removeAnweisung = this.removeAnweisung.bind(this)
    }

    /**
     * takes the name and makes it url conform
     * @param {String} name 
     */
    generatePath(name) {
        return `/${name.toLocaleLowerCase().replace(/-+/g, " ").replace(/\s+/g, "-").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")}`
    }

    /**
     * function will be called after state of parent is changed
     * reset the state so component is rerendered with new changes
     * @param {object} nextProps 
     */
    componentWillReceiveProps(nextProps) {

        this.setState({ ...nextProps.data, path: this.generatePath(nextProps.data.name), dontChangeFocus: true });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(oldState => {
            oldState[name] = value;
            oldState.dontChangeFocus = true

            if (name === "name") oldState.path = this.generatePath(value)

            return oldState;
        });
    }

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        let data = this.state;
        data.anweisungen = data.anweisungen.map(anweisung => anweisung.anweisung)
        data.kategorien = data.kategorien.map(kategorie => kategorie.kategorie)
        data.zutaten = data.zutaten.map(zutat => ({ anzahl: zutat.anzahl, name: zutat.name }))
        var YAML = require('json2yaml'), ymlText;
        ymlText = YAML.stringify(this.state);

        this.download(`${this.state.name}.yaml`, ymlText)
    }

    /**
     * creates a file with the given text and filename and offers a download
     * @param {string} filename 
     * @param {string} text 
     */
    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }



    /**
     * gets called after that state is changed and render() was called again. focuses on the newest line of zutaten
     */
    componentDidUpdate() {
        if (!this.state.dontChangeFocus) {
            const newestZutat = this.state.zutaten.reduce((acc, curr) => curr.created > acc.created ? curr : acc, { created: 0 })
            const newestAnweisung = this.state.anweisungen.reduce((acc, curr) => curr.created > acc.created ? curr : acc, { created: 0 })
            const newestKategorie = this.state.kategorien.reduce((acc, curr) => curr.created > acc.created ? curr : acc, { created: 0 })
            const array = [
                { ...newestZutat, selector: "anzahl" },
                { ...newestAnweisung, selector: "anweisung" },
                { ...newestKategorie, selector: "kategorie" }
            ]
            const newestElement = array.sort((a, b) => a.created - b.created).pop()
            const input = document.getElementById(`${newestElement.selector}_${newestElement.id}`)
            if (input) input.focus()
        }
    }

    /**
     * adds a zutat object with set values to the state
     * @param {object} zutat 
     */
    addZutat(zutat) {
        this.setState(state => {
            let oldState = this.state
            oldState.zutaten.push({
                id: Math.max(0, ...oldState.zutaten.map(zutat => zutat.id)) + 1,
                created: new Date().getTime(),
                ...zutat
            })
            oldState.dontChangeFocus = false
            return oldState
        })
    }

    /**
     * adds a new zutat without values to the state
     * @param {event} evt 
     */
    addNewZutat(evt) {
        evt.preventDefault()
        this.addZutat({
            anzahl: "",
            name: "",
        })
    }

    /**
     * adds a anweisung object with set value to the state
     * @param {string} anweisung 
     */
    addAnweisung(anweisung) {
        this.setState(state => {
            let oldState = this.state
            oldState.anweisungen.push({
                id: Math.max(0, ...oldState.anweisungen.map(anweisung => anweisung.id)) + 1,
                created: new Date().getTime(),
                anweisung: anweisung
            })
            oldState.dontChangeFocus = false
            return oldState
        })
    }

    /**
     * adds a new anweisung without value to the state
     * @param {event} evt 
     */
    addNewAnweisung(evt) {
        evt.preventDefault()
        this.addAnweisung("")
    }

    /**
     * when either enter or tab is pressed in a anweisung input a new anweisung will be created
     * @param {event} evt 
     */
    handleKeyAnweisung(evt) {
        if (evt.key === "Enter" || evt.key === "Tab") {
            if (evt.target.value !== "") {
                this.addNewAnweisung(evt)
            }
        }
    }

    /**
    * when either enter or tab is pressed in a kategorie input a new kategorie will be created
    * @param {event} evt 
    */
    handleKeyKategorie(evt) {
        if (evt.key === "Enter" || evt.key === "Tab") {
            if (evt.target.value !== "") {
                this.addNewKategorie(evt)
            }
        }
    }

    /**
     * when a text is pasted into an anweisung field it will be split by the line breaks and each line saved as new anweisung
     * @param {event} event 
     */
    handlePasteAnweisung(event) {
        let paste = event.clipboardData.getData('text');

        let entries = paste.split("\n").filter(entry => entry.trim() !== "")
        if (entries.length > 1) {
            entries.forEach(this.addAnweisung)
            event.preventDefault();
        }
    }


    /**
     * adds a new kategorie without value to the state
     * @param {event} evt 
     */
    addNewKategorie(evt) {
        evt.preventDefault()
        this.addKategorie("")
    }

    /**
    * adds a anweisung object with set value to the state
    * @param {string} kategorie 
    */
    addKategorie(kategorie) {
        this.setState(state => {
            let oldState = this.state
            oldState.kategorien.push({
                id: Math.max(0, ...oldState.kategorien.map(kategorie => kategorie.id)) + 1,
                created: new Date().getTime(),
                kategorie: kategorie
            })
            oldState.dontChangeFocus = false
            return oldState
        })
    }

    /**
     * when enter is pressed in the anzahl-input it will automatically focus on the next input
     * when enter or tab is pressed in the value input it will automatically create the next zutat
     * @param {event} evt 
     */
    handleKeyZutat(evt) {
        switch (evt.target.getAttribute("name")) {
            case "anzahl":
                if (evt.key === "Enter") {
                    evt.preventDefault()
                    evt.target.parentElement.parentElement.querySelector(".zutat.name").focus()
                }
                break;
            case "name":
                if (evt.key === "Enter" || evt.key === "Tab") {
                    if (evt.target.value !== "") {
                        this.addNewZutat(evt)
                    }
                }
                break;
            default: break;
        }
    }

    /**
     * when data is pasted into the zutat input it will be split by the lines and new zutaten will be created
     * @param {event} event 
     */
    handlePasteZutat(event) {
        let paste = event.clipboardData.getData('text');


        let entries = paste.split("\n")
        entries.forEach(entry => {
            let split = entry.split(/\s+/)
            let amount = split.shift()
            let name = split.join(" ")
            this.addZutat({
                anzahl: amount,
                name: name,
            })
        })

        event.preventDefault();
    }

    /**
     * removes kategorie from the state
    * @param {number} id 
     */
    removeKategorie(id) {
        this.setState(state => {
            let oldState = this.state
            oldState.kategorien = oldState.kategorien.filter(kategorie => kategorie.id !== id)
            return oldState
        })
    }


    /**
     * removes anweisung from the state
     * @param {number} id 
     */
    removeAnweisung(id) {
        this.setState(state => {
            let oldState = this.state
            oldState.anweisungen = oldState.anweisungen.filter(anweisung => anweisung.id !== id)
            return oldState
        })
    }

    /**
    * removes an weisung from the state
    * @param {number} id 
    */
    removeZutat(id) {
        this.setState(state => {
            let oldState = this.state
            oldState.zutaten = oldState.zutaten.filter(zutat => zutat.id !== id)
            return oldState
        })
    }

    handleImageSelect(evt) {
        // Assuming only image
        var file = evt.target.files[0]
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            this.setState(oldState => {
                oldState.image = reader.result
                return oldState
            })
        }
    }

    handleChangeMultiple(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const data = JSON.parse(target.getAttribute("data"))


        this.setState(oldState => {

            oldState.dontChangeFocus = true

            oldState[data.key].find(obj => obj.id === data.id)[name] = value

            return oldState;
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group wow slideInUp">
                    <label htmlFor="name">Name des Rezepts</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Kartoffelbrei..."
                        value={this.state.name}
                        onChange={this.handleInputChange} />
                </div>

                <div className="form-group wow slideInUp">
                    <label htmlFor="path">Relativ URL des Rezeptes</label>
                    <input
                        type="text"
                        className="form-control"
                        id="path"
                        name="path"
                        placeholder="/..."
                        value={this.state.path}
                        readOnly={true} />
                </div>

                <div className="custom-file wow slideInUp">
                    <label htmlFor="image">Rezeptbild</label>
                    <input type="file" className="custom-file-input" id="image" accept="image/*" onChange={this.handleImageSelect} />
                    <label className="custom-file-label" htmlFor="image">Bild auswählen</label>
                </div>

                <div className="recipe-picture wow slideInUp" style={{ width: "50%" }}>
                    <img style={{ width: "100%" }} alt="Rezeptbild" src={this.state.image || placeholder} />
                </div>
                <br />

                <div className="form-group wow slideInUp">
                    <label htmlFor="zeit">Dauer des Rezepts</label>
                    <input
                        type="text"
                        className="form-control"
                        id="zeit"
                        placeholder="1:00 H..."
                        name="zeit"
                        value={this.state.zeit}
                        onChange={this.handleInputChange} />
                </div>

                <div className="form-group wow slideInUp">
                    <label htmlFor="schwierigkeit">Schwierigkeit (1-5)</label>
                    <select
                        className="form-control"
                        id="schwierigkeit"
                        aria-describedby="schwierigkeitsHelp"
                        name="schwierigkeit"
                        value={this.state.schwierigkeit}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputChange}>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                    <small id="schwierigkeitsHelp" className="form-text text-muted">1 = Leicht, 5 = Schwer</small>
                </div>

                <div className="form-group wow slideInUp">
                    <label htmlFor="portionen">Anzahl der Portionen</label>
                    <input
                        type="text"
                        className="form-control"
                        id="portionen"
                        placeholder="4..."
                        name="portionen"
                        value={this.state.portionen}
                        onChange={this.handleInputChange} />
                </div>

                <div className="form-group wow slideInUp">
                    <span>Zutaten</span>
                    <button style={{ marginLeft: "25px" }} tabIndex={-1} onClick={this.addNewZutat} className="btn btn-secondary"><FontAwesomeIcon icon={faPlus} /> Weitere Zutat</button>
                    <table id="zutaten">
                        <thead>
                            <tr>
                                <th>Anzahl</th>
                                <th>Name</th>
                                <th>Entfernen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.zutaten.map(zutat => (
                                <tr key={zutat.id}>
                                    <td style={{ width: "10%" }}>
                                        <input
                                            id={`anzahl_${zutat.id}`}
                                            type="text"
                                            name="anzahl"
                                            className="form-control anzahl zutat"
                                            placeholder="250..."
                                            onKeyDown={this.handleKeyZutat}
                                            onPaste={this.handlePasteZutat}
                                            defaultValue={zutat.anzahl}
                                            onChange={this.handleChangeMultiple}
                                            data={JSON.stringify({ key: "zutaten", id: zutat.id })}
                                        />
                                    </td>
                                    <td style={{ width: "90%" }}>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control name zutat"
                                            placeholder="ml süße Sahne..."
                                            onKeyDown={this.handleKeyZutat}
                                            defaultValue={zutat.name}
                                            onChange={this.handleChangeMultiple}
                                            data={JSON.stringify({ key: "zutaten", id: zutat.id })} />
                                    </td>
                                    <td>
                                        <button style={{ marginLeft: "5px" }} tabIndex={-1} onClick={() => this.removeZutat(zutat.id)} className="btn btn-secondary"><FontAwesomeIcon icon={faTimesCircle} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="form-group wow slideInUp">
                    <span>Anweisungen</span>
                    <button style={{ marginLeft: "25px" }} tabIndex={-1} onClick={this.addNewAnweisung} className="btn btn-secondary"><FontAwesomeIcon icon={faPlus} /> Weitere Anweisung</button>
                    <table id="anweisungen">
                        <thead>
                            <tr>
                                <th>Anweisung</th>
                                <th>Entfernen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.anweisungen.map(anweisung => (
                                <tr key={anweisung.id}>
                                    <td style={{ width: "100%" }}>
                                        <textarea
                                            id={`anweisung_${anweisung.id}`}
                                            type="text"
                                            name="anweisung"
                                            className="form-control anweisung"
                                            placeholder="Ofen vorheizen..."
                                            onKeyDown={this.handleKeyAnweisung}
                                            onPaste={this.handlePasteAnweisung}
                                            defaultValue={anweisung.anweisung}
                                            onChange={this.handleChangeMultiple}
                                            data={JSON.stringify({ key: "anweisungen", id: anweisung.id })}
                                        />
                                    </td>
                                    <td>
                                        <button style={{ marginLeft: "5px" }} tabIndex={-1} onClick={() => this.removeAnweisung(anweisung.id)} className="btn btn-secondary"><FontAwesomeIcon icon={faTimesCircle} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="form-group wow slideInUp">
                    <span>Kategorien</span>
                    <button style={{ marginLeft: "25px" }} tabIndex={-1} onClick={this.addNewKategorie} className="btn btn-secondary"><FontAwesomeIcon icon={faPlus} /> Weitere Kategorie</button>
                    <table id="kategorien">
                        <thead>
                            <tr>
                                <th>Kategorie</th>
                                <th>Entfernen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.kategorien.map(kategorie => (
                                <tr key={kategorie.id}>
                                    <td style={{ width: "100%" }}>
                                        <input
                                            id={`kategorie_${kategorie.id}`}
                                            type="text"
                                            name="kategorie"
                                            className="form-control kategorie"
                                            placeholder="Fleisch..."
                                            onKeyDown={this.handleKeyKategorie}
                                            defaultValue={kategorie.kategorie}
                                            onChange={this.handleChangeMultiple}
                                            data={JSON.stringify({ key: "kategorien", id: kategorie.id })}
                                        />
                                    </td>
                                    <td>
                                        <button style={{ marginLeft: "5px" }} tabIndex={-1} onClick={() => this.removeKategorie(kategorie.id)} className="btn btn-secondary"><FontAwesomeIcon icon={faTimesCircle} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="form-group wow slideInUp">
                    <label htmlFor="anmerkungen">Anmerkungen</label>
                    <textarea
                        type="text"
                        className="form-control"
                        id="anmerkungen"
                        placeholder="Dazu eignet sich ..."
                        name="anmerkungen"
                        value={this.state.anmerkungen}
                        onChange={this.handleInputChange} />
                </div>
                <div className="form-group wow slideInUp">
                    <label htmlFor="quelle">Quelle</label>
                    <input
                        type="text"
                        className="form-control"
                        id="quelle"
                        placeholder="https://..."
                        name="quelle"
                        value={this.state.quelle}
                        onChange={this.handleInputChange} />
                </div>

                <button type="submit" className="btn btn-primary">Rezept erstellen</button>
            </form >
        );
    }
}

export default RezeptForm