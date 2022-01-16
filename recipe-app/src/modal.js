import React from 'react';


class Modal extends React.Component{

    getIntegridents(){
        const ingredient="strIngredient";
        const measure="strMeasure";
        let ingredients=[];
        let i=1;
        while(this.props.recipe[ingredient+i]){
            const ingr=this.props.recipe[measure+i].trim()?
                        `${this.props.recipe[ingredient+i]} (${this.props.recipe[measure+i]})`:
                        `${this.props.recipe[ingredient+i]}`;
            ingredients.push(ingr);
            i++;
        }
        return ingredients;
    }
    
  render(){
    return(
        <div className={`modal${this.props.show && this.props.recipe?" show":""}`} >
           { this.props.recipe? 
            <div className="modal-container">
                <div className="modal-title">
                    <span>{this.props.recipe.strMeal}</span>
                    <span onClick={this.props.removeCurRecipe}><i className="fas fa-times"></i></span>
                </div>
                <div className="modal-body">
                    <div><img src={this.props.recipe.strMealThumb} alt="jlfjl"/></div>
                    <div>
                        <div className="cate">
                            <span>Category:</span>
                            <span><span>{this.props.recipe.strArea}</span><span>{this.props.recipe.strCategory}</span></span>
                        </div>
                        <div className="method">
                            <span>Instructions:</span>
                            <p>{this.props.recipe.strInstructions}</p>
                        </div>
                        <div className="ingredients">
                            <span>Ingredients:</span>
                            <ul>
                            {this.getIntegridents().map((ingredient,inx)=><li key={inx}>{ingredient}</li>)}
                                
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='modal-footer'>
                    <button type="button" onClick={this.props.removeCurRecipe}><i className="fas fa-times"></i> Close</button>
                </div>
            </div>
        :""}
        </div>
      
    )
  }
}

export default Modal;
