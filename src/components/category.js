import React from "react"

/**
 * a receipt can have 1 or more categories. On top of the homepage there is a list with all possible categories. this class represents on entry of the categories
 */
class Category extends React.Component {

    render() {
        return (
            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6">
                <div className="category-item text-center" category={this.props.name}>
                    <img src={this.props.image} alt="milk" width="48" height="48" />
                    <br />
                    {this.props.name}
                </div>
            </div>
        );
    }
}

export default Category;