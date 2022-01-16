import React from 'react';
import './App.css';
import SearchBar  from './searchbar';
import FavRecipe from './favrecipe';
import RandomRecipe from './randomrecipe';
import Modal from './modal';
import key,{defaultMaxReq} from './key';


class App extends React.Component{
  constructor(props){
    super(props);
    this.state={recipes:[],curRecipe:null,show:false,requested:0,uniqueKeys:new Set(),
                favrecipes:[],isMsgReq:false,isAdding:true,countries:[],maxReq:defaultMaxReq,
                showLoading:true,curRemoveFavRecipeId:null,isRecipeByName:false};
    this.setCurRecipe=this.setCurRecipe.bind(this);
  }
  checkAndDisableMsgReq=()=>{
    if(this.state.isMsgReq){
      this.setState({isMsgReq:false,isAdding:true});
    }
  }
  
  loadNewRecipes=()=>{
    this.setState({requested:0,uniqueKeys:new Set(),recipes:[],maxReq:defaultMaxReq});
    for(let i=0;i<defaultMaxReq;i++){
      this.getRandomRecipe();
    }
  }

  removeCurRecipe=()=>{
    document.body.classList.remove("hidden-overflow");
    this.setState({curRecipe:null,show:false})
  }
  setCurRecipe(recipe){
    document.body.classList.add("hidden-overflow");
    this.setState({curRecipe:{...recipe},show:true});
  }
  
  updateFavRecipes=(id)=>{
    if(this.state.favrecipes.includes(id)){
      this.setState((state)=>{
          const favrecipes=state.favrecipes.filter((recipeId)=>recipeId!==id);
          localStorage.setItem(key,JSON.stringify(favrecipes));

          return {favrecipes,isAdding:false,isMsgReq:true,curRemoveFavRecipeId:id};
      });
    }
    else{
        this.setState((state)=>{
            const favrecipes=[id,...state.favrecipes];
            localStorage.setItem(key,JSON.stringify(favrecipes));
            return {favrecipes,isAdding:true,isMsgReq:true,curRemoveFavRecipeId:null};
        });
    }
  }

  getFavoriteRecipe(){
    this.setState({favrecipes:localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)):[]})
  }

  checkAndUpdateRandomRecipes(data){
    if(data.meals && !this.state.uniqueKeys.has(data.meals[0].idMeal)){
      this.setState((state)=>{
        const requested=state.requested+1;
        const uniqueKeys=state.uniqueKeys;
        uniqueKeys.add(data.meals[0].idMeal);
        return {recipes:[...state.recipes,data.meals[0]],uniqueKeys,requested,showLoading:requested!==state.maxReq}
      });
    }
    else{
      this.setState((state)=>{
        const requested=state.requested+1;
        return {requested,showLoading:requested!==state.maxReq}
      });
    }
  }

  async getRandomRecipe(){
      const resp=await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data=await resp.json();
      this.checkAndUpdateRandomRecipes(data);

  }

  async getCountriesName(){
    const resp=await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    const data=await resp.json();
    const countries=["All World Recipes"];
    data.meals.forEach((area,indx)=>{
      if(indx !==25) 
        countries.push(`${area.strArea} Recipes`)
    });
    this.setState({countries:[...countries]});
  }
  async getRecipeById(id){
    const resp=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data=await resp.json();
    this.checkAndUpdateRandomRecipes(data);
  }

  loadRecipeByCountry=async (indx)=>{
    if(indx===0){
      this.setState({requested:0,uniqueKeys:new Set(),recipes:[],maxReq:defaultMaxReq});
      for(let i=0;i<defaultMaxReq;i++){
        this.getRandomRecipe();
      }
    }
    else{
      const countryName=this.state.countries[indx].split(" ")[0];
      const resp=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${countryName}`);
      const recipesId=await resp.json();
      const idArr=[];
      recipesId.meals.forEach((obj)=>idArr.push(obj.idMeal));
      this.setState({requested:0,uniqueKeys:new Set(),recipes:[],maxReq:idArr.length,showLoading:true});
      idArr.forEach((id)=>this.getRecipeById(id))
    }
    
  }

  loadRecipeByName=async (recipeName)=>{
    this.setState({showLoading:true});
    const resp=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
    const data=await resp.json();
    const meals=data.meals??[];
    this.setState({recipes:meals,requested:meals.length,uniqueKeys:new Set(),maxReq:meals.length,showLoading:false,isRecipeByName:true})
  }

  

  componentDidMount(){
    this.getFavoriteRecipe();
    this.getCountriesName();
    for(let i=0;i<this.state.maxReq;i++){
      this.getRandomRecipe();
    }
 
  }
  

  render(){
    return(
      <>
        <SearchBar loadRecipeByName={this.loadRecipeByName}/>

        <FavRecipe setCurRecipe={this.setCurRecipe} isAdding={this.state.isAdding} isMsgReq={this.state.isMsgReq}
                  favrecipes={this.state.favrecipes} updateFavRecipes={this.updateFavRecipes} 
                  disableMsgReq={this.checkAndDisableMsgReq} curRemoveFavRecipeId={this.state.curRemoveFavRecipeId}/>

        <RandomRecipe recipes={this.state.recipes} setCurRecipe={this.setCurRecipe} 
                      favrecipes={this.state.favrecipes} updateFavRecipes={this.updateFavRecipes} 
                      showLoading={this.state.showLoading} loadNewRecipes={this.loadNewRecipes}
                      countries={this.state.countries} loadRecipeByCountry={this.loadRecipeByCountry}
                      isRecipeByName={this.state.isRecipeByName}/>

        <Modal recipe={this.state.curRecipe} removeCurRecipe={this.removeCurRecipe} show={this.state.show}/>
      </>
    )
  }
}

export default App;
