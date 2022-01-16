import React from "react";
import key,{scrollAmount} from "./key";


export default class FavRecipe extends React.Component{
    constructor(props){
        super(props);
        this.state={favrecipes:[],totalRecipeCount:0,curRecipeCount:0,
                            rightScrollReq:false,leftScrollReq:false,maxScrollWidth:0,currentPos:0};
        this.handleScroll=this.handleScroll.bind(this);
        this.ulRef=null;
    }
    handleScroll(dir,e){
        this.setState((state)=>{
            let currentPos=state.currentPos+(dir*scrollAmount);
            let rightScrollReq=state.rightScrollReq;
            let leftScrollReq=state.leftScrollReq;
            if(currentPos<state.maxScrollWidth){
                currentPos=state.maxScrollWidth;
                leftScrollReq=true;
                rightScrollReq=false;
            }
            else{
                rightScrollReq=true;
            }
            if(currentPos>=0){
                currentPos=0;
                leftScrollReq=false;
                rightScrollReq=true;
            }
            else{
                leftScrollReq=true;
            }
            return {currentPos:currentPos,leftScrollReq,rightScrollReq};
        })
    }
    initScrollValues=(element)=>{
        if(element){
            const maxScrollWidth=element.parentElement.offsetWidth-element.offsetWidth;
            this.ulRef=element;
            if(maxScrollWidth<0){
                this.setState({currentPos:0,rightScrollReq:true,leftScrollReq:false,maxScrollWidth:maxScrollWidth})
            }
            else{
                this.setState({currentPos:0,rightScrollReq:false,leftScrollReq:false,maxScrollWidth:0})
            }
        }
    }
    handleResize=(e)=>{
        this.initScrollValues(this.ulRef);

    }
    
    async fetchRecipe(recipeId){
        try{
            const resp=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
            const data=await resp.json();
            this.setState((state)=>{
                if(state.curRecipeCount<state.totalRecipeCount){
                    let favrecipes;
                    if(!state.curRecipeCount){
                        favrecipes=[];
                    }
                    else favrecipes=[...state.favrecipes];
                    favrecipes.push(data.meals[0]);
                    const curRecipeCount=state.curRecipeCount+1;

                    //sort favrcipes acording order stored when all recipes have been loaded
                    if(curRecipeCount===state.totalRecipeCount){
                        const orderFavrecipes=JSON.parse(localStorage.getItem(key));
                        favrecipes.sort((recipe1,recipe2)=>{
                            return orderFavrecipes.indexOf(recipe1.idMeal)-orderFavrecipes.indexOf(recipe2.idMeal);
                        })
                    }
                    return {favrecipes,curRecipeCount}
                }
                return {favrecipes:state.favrecipes,curRecipeCount:state.curRecipeCount}
                
            })

        }
        catch(err){
            this.loadFavRecipes();
        }
        

    }

    removeSingleFavRecipe(id){
        this.setState((state)=>{
            const favrecipes=state.favrecipes.filter((recipe)=>recipe.idMeal!==id);
            return {favrecipes,totalRecipeCount:favrecipes.lengh,curRecipeCount:favrecipes.lengh};
        });
    }

    loadSingleFavRecipe(id,newCount){
        this.setState({totalRecipeCount:newCount})
        this.fetchRecipe(id)
    }
    loadFavRecipes(){
        for(let recipeId of this.props.favrecipes){
            this.fetchRecipe(recipeId);
        }
        this.setState({totalRecipeCount:this.props.favrecipes.length,curRecipeCount:0,favrecipes:[]});
    }
    showRecipeDetail(recipe){
        this.props.setCurRecipe(recipe);
    }
    componentDidMount(){
        this.loadFavRecipes();
        window.addEventListener("resize",this.handleResize);
    }
    shouldComponentUpdate(nextProps,nextState){
        if(nextState.totalRecipeCount===nextState.curRecipeCount){
            this.props.disableMsgReq();
            return true;
        }
        
        return false;
    }
    componentDidUpdate(prevProp,prevState){
        
        const diff=this.props.favrecipes.length-this.state.totalRecipeCount;
        if(diff!==0){
            // 
            if(diff===1){
                this.loadSingleFavRecipe(this.props.favrecipes[0],this.props.favrecipes.length);
            }
            else if(diff===-1 && this.props.curRemoveFavRecipeId){
                this.removeSingleFavRecipe(this.props.curRemoveFavRecipeId);
            }
            else{
                this.loadFavRecipes();
            }
            
        }
        
    }
    componentWillUnmount(){
        window.removeEventListener("resize",this.handleResize);
    }
    render(){
        if(this.state.favrecipes.length){
            return (
                <div className="container fav-recipe" >
                    { this.props.isMsgReq?
                        this.props.isAdding?<span>Adding to favorite recipes...</span>:<span>Removing from favorite recipes...</span>:
                        <>
                            {this.state.leftScrollReq && 
                                <div className="left-scroll-wrapper">
                                    <button type="button" className="left-scroll-btn" onClick={this.handleScroll.bind(this,1)}>
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                </div>
                            }
                            <ul ref={this.initScrollValues} style={{left:`${this.state.currentPos}px`}}>
                                {this.state.favrecipes.map((recipe)=>{
                                    return (
                                        <li key={recipe.idMeal}>
                                            <img src={recipe.strMealThumb} alt={recipe.strMeal}/>
                                            <p>{recipe.strMeal}</p>
                                            <button type="button" onClick={this.showRecipeDetail.bind(this,recipe)}>More</button>
                                            <span className="close-btn" onClick={(e)=>{this.props.updateFavRecipes(recipe.idMeal)}}>&times;</span>
                                        </li>
                                    )
                                })}
                            </ul>
                            {this.state.rightScrollReq && 
                                <div className="right-scroll-wrapper">
                                    <button type="button" className="right-scroll-btn" onClick={this.handleScroll.bind(this,-1)}>
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            }
                        </>
                    }
                </div>
            )
        }
        else{
            return <div></div>
        }
    }
}