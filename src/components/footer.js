import React from "react"
import { Animated } from "react-animated-css";

/**
 * a footer of the page that will be shown at the end of each page including a copyright notice
 */
class Footer extends React.Component {
    render() {
        return (
            <footer>
                <Animated className="wow" animationIn="bounce">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 col-sm-12 text-center">
                                <h3>About</h3>
                                <div className="footer-about">
                                    "A recipe book is one that you use daily and what we in our family
                                    call 'a living book' — a book that you use all the time,
                                    not just read once and discard on the shelf.
                                    Recipes are by nature derivative and meant to be shared -
                                    that is how they improve, are changed, how new ideas are formed. ”
                           </div>
                            </div>
                            <div className="col-md-6 col-sm-12 text-center">
                                <div className="footer-author">
                                    Template made with <i className="fa fa-heart" aria-hidden="true"></i> love by <a href="https://jraleman.com/" target="_blank" rel="noreferrer">Jose Ramon</a>,
                               <br />
                               modified and used by <a href="https://github.com/drik98" target="_blank" rel="noreferrer">Hendrik Schmitz</a>.
                               <br />
                               © {new Date().getFullYear()}, Built with {` `}<a href="https://www.gatsbyjs.org">Gatsby</a>
                                    <br />
                               Rezepte von Hendrik und Familie
                           </div>
                            </div>
                        </div>
                    </div>
                </Animated>
            </footer>
        )
    }
}


export default Footer