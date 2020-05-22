import React from "react"
import { Animated } from "react-animated-css";
import WOW from 'wowjs';
import Category from "./category"

import milk from "../images/icons/milk.png"
import meat from "../images/icons/steak.png"
import fish from "../images/icons/fish.png"
import vegan from "../images/icons/vegan.png"
import peanuts from "../images/icons/peanuts.png"
import chili from "../images/icons/chili.png"

/**
 * used on the home page to create all categories.
 */
class Categories extends React.Component {

    /**
     * adds functionality to the category buttons to only show recipsed from said category
     */
    componentDidMount() {
        const wow = new WOW.WOW();

        /**
         * when a cateory is pressed only the recipes with given category should be visible
         * @param {event} evt 
         */
        const handleCategoryChange = target => {

            // unselect all other elements and select the current one
            document.querySelectorAll(".category-item.selected").forEach(selectedItem => selectedItem.classList.remove("selected"));
            target.classList.add("selected");

            // get the category from the selected button
            const selectedCategory = target.getAttribute("category").toLocaleLowerCase();
            const showAllRecipes = selectedCategory === "all";

            const recipes = document.querySelectorAll(".recipe-item");

            let amountOfRecipes = 0;
            recipes.forEach(recipe => {

                const categories = (recipe.getAttribute("categories") || "").toLocaleLowerCase().split(",");
                if (categories.includes(selectedCategory) || showAllRecipes) {
                    recipe.classList.remove("hidden");
                    // wow.js only shows elements that are in view. 
                    // so there are cases that elements are still hidden after filter is applied
                    // so wow.show is called that the element will be shown.
                    wow.show(recipe.parentElement);
                    ++amountOfRecipes;
                } else {
                    recipe.classList.add("hidden");
                }
            })
            // if no recipes are shown currently, a message will be shown that there are no receipses available
            if (amountOfRecipes === 0) {
                document.getElementById("no-recipes").classList.remove("hidden");
            } else {
                document.getElementById("no-recipes").classList.add("hidden");
            }

        };

        // add the eventlistener to all category items
        const categorieButtons = document.querySelectorAll(".category-item");
        categorieButtons.forEach(button => {
            button.addEventListener("click", () => handleCategoryChange(button));
        });

    }

    render() {
        return (
            <section id="categories">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>Kategorien</h2>
                        </div>
                    </div>
                    <Animated animationIn="zoomIn" isVisible={true} className="row wow zoomIn">
                        <Category name="Frühstück" alt="milk" image={milk} />
                        <Category name="Fleisch" alt="meat" image={meat} />
                        <Category name="Fisch" alt="fish" image={fish} />
                        <Category name="Vegetarisch" alt="vegan" image={vegan} />
                        <Category name="Vorspeise" alt="chili" image={chili} />
                        <Category name="Nachtisch" alt="peanuts" image={peanuts} />
                    </Animated>

                    <Animated animationIn="zoomIn" isVisible={true} className="row wow zoomIn">
                        {/* the "show-all" entry differs from all other categories */}
                        <div className="col-12 text-center show-all">
                            <div className="category-item text-center selected" category="all">
                                <i className="fa fa-cutlery fa-2x" aria-hidden="true"></i>
                                <br />
                                    Alle anzeigen
                                </div>
                        </div>
                    </Animated>
                </div>
            </section>
        )
    }
}



export default Categories