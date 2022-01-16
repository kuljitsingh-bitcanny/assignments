import React from "react";


export default class RandomRecipe extends React.Component{
    constructor(props){
        super(props);
        this.state={showRecipeContainer:true,activeItemIndx:0,activeItemName:"",
                    showCountries:false,isLoadMoreReq:true};
    }
    toggleFavRecipe(id,e){
        this.props.updateFavRecipes(id);
    }
     showRecipeDetails(recipe){
        this.props.setCurRecipe(recipe);
     }
     loadNewRandomRecicpes=()=>{
         this.setState({showRecipeContainer:false});
         this.props.loadNewRecipes();
     }
     toggleCountryList=()=>{
         this.setState((state)=>{
             return {showCountries:!state.showCountries}
         });
     }

     changeActiveItem=(indx)=>{
         this.setState({activeItemIndx:indx,activeItemName:this.props.countries[indx],
                        showCountries:false,showRecipeContainer:false,isLoadMoreReq:indx===0});
         this.props.loadRecipeByCountry(indx);
     }

     componentDidUpdate(prevProps,prevStates){
        if(prevProps.recipes.length>0 && !prevStates.showRecipeContainer){
            this.setState({showRecipeContainer:true});
        }
        if(prevProps.countries.length>0 && prevStates.activeItemName.length<=0){

           this.setState({activeItemName:prevProps.countries[0]})
        }
    }

    render(){
        if(this.state.showRecipeContainer && !this.props.showLoading){
            if(this.props.recipes.length){
                return (
                    <div className="container random-recipe-container">
                        {!this.props.isRecipeByName && 
                            <div className="extra-optns">
                                <div className="dropdown-wrapper">
                                    <span className="active-item-name" onClick={this.toggleCountryList} 
                                            data-icon={this.state.showCountries?"":""}>{this.state.activeItemName}</span>
                                    <div className={this.state.showCountries?"dropdown":"dropdown hidden-dropdown"}>
                                        {this.props.countries.map((country,indx)=>{
                                            return <span key={indx} className={indx===this.state.activeItemIndx?"active-item item":"item"} 
                                                        onClick={this.changeActiveItem.bind(this,indx)}>{country}</span>
                                        })}
                                    </div>
                                </div>
            
                                {this.state.isLoadMoreReq &&  
                                    <button type="button" onClick={this.loadNewRandomRecicpes}>
                                        <i className="fas fa-redo"></i> Load new recipes
                                    </button>
                                }
                                    
                            </div>
                        }
                        <ul>
                        {this.props.recipes.map((recipe)=>{
                            return (
                                <li key={recipe.idMeal} className="card">
                                    <img src={recipe.strMealThumb} alt={recipe.strMeal}/>
                                    <div>
                                        <span>{recipe.strMeal}</span>
                                        <button type="button" onClick={this.toggleFavRecipe.bind(this,recipe.idMeal)}
                                            className={`${this.props.favrecipes.includes(recipe.idMeal)?"remove-btn":""}`}>
                                            <i className="fas fa-heart"></i> 
                                            <span style={{marginLeft:"0.125rem"}}>{this.props.favrecipes.includes(recipe.idMeal)?" Remove from Favorite":" Add to Favorite"}</span>
                                        </button>
                                    </div>
                                   <div>
                                        <button className="recipe-detail-btn" type="button"  onClick={this.showRecipeDetails.bind(this,recipe)}>
                                            <i className="far fa-eye"></i>&nbsp;Show detail recipe
                                        </button>
                                   </div>
                                </li>
                            )
                        })}
                        </ul>
                        
                    </div>
                )
            }
            else{
                return (
                    <div className="container random-recipe-container">
                        <div className="no-recipe">No recipe with given name.Try using different recipe name.</div>
                    </div>
                )
            }
        }
        else{
            return (
                <div className="container random-recipe-container">
                    <div className="loader">
                        <span>
                            <span></span>
                            <span>Loading new recipes please wait...</span>
                        </span>
                    </div>
                </div>
            )
        }
        
    }
}