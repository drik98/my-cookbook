import React from "react"
import Image from "./image"
import { Animated } from "react-animated-css";
import { Link } from "gatsby"

/**
 * creates an receipt entry on the homepage. one receipt entry consist of the name and a picture of the receipt. 
 * it includes a link bringing you to the receipt
 */
class Receipt extends React.Component {

    render() {
        return (
            <Animated className="col-lg-4 col-md-6 col-sm-12 wow" animationIn="fadeIn">
                <div className="recipe-item text-center" categories={this.props.data.kategorien?.join()}>
                    <Link to={this.props.data.path}>
                        <Image
                            imgsrc={this.props.data.image}
                            alt={this.props.name}
                        />
                    </Link>
                    <br />
                    <h3>{this.props.data.name}</h3>
                </div>
            </Animated>
        );
    }
}

export default Receipt;