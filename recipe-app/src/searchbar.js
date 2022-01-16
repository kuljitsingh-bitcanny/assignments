import React from "react";
import recipe from "./image/recipe.png";



export default class SearchBar extends React.Component{
    
    constructor(props){
        super(props)
        this.state={recipeName:"",showSmallDeviceForm:false,showResetBtn:false};
        this.handleChange=this.handleChange.bind(this);
    }

    getRecipeByName=(name)=>{
        this.props.loadRecipeByName(name);
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        if(this.state.recipeName){
            this.getRecipeByName(this.state.recipeName);
            this.setState({showResetBtn:false,showSmallDeviceForm:false});
        }
    }
    handleChange(e){
        this.setState({recipeName:e.target.value,showResetBtn:(e.target.value.length>0)});
        
    }
    showForm=(e)=>{
        
        this.setState((state)=>{
            return {showSmallDeviceForm:true,showResetBtn:state.recipeName.length>0};
        })
    }
    setsmallDeviceInput=(ele)=>{
        ele && ele.focus();
    }
    
    hideForm=(e)=>{
        this.setState({showSmallDeviceForm:false})
    }
    resetFormInput=(e)=>{
        this.setState({recipeName:"",showResetBtn:false});
    }

    handleResize=(e)=>{
        if(e.target.innerWidth>=420){
            this.setState({showSmallDeviceForm:false});
        }
    }

    componentDidMount(){
        window.addEventListener("resize",this.handleResize);
        window.addEventListener("load",this.handleResize);
    }

    componentWillUnmount(){
        window.removeEventListener("resize",this.handleResize);
        window.removeEventListener("load",this.handleResize);
    }
    
    render(){
        return (
            <div className="container search-container">
                {!this.state.showSmallDeviceForm && <a href="/"><img src={recipe} alt="Logo"/></a>}
                <form onSubmit={this.handleSubmit} className="recipe-search-form-md">
                    <input type="text" value={this.state.recipeName} onChange={this.handleChange} placeholder="search recipe name"/>
                    <button type="submit"><i className="fas fa-search"></i></button>
                </form>
                {this.state.showSmallDeviceForm && 
                    <form onSubmit={this.handleSubmit} className="recipe-search-form-sm show-form">
                        <button type="button" className="close-btn" onClick={this.hideForm}>
                            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M21,11v1H5.64l6.72,6.72l-0.71,0.71L3.72,11.5l7.92-7.92l0.71,0.71L5.64,11H21z"></path>
                            </svg>
                        </button>
                        <input type="text" value={this.state.recipeName} onChange={this.handleChange} ref={this.setsmallDeviceInput} placeholder="search recipe name"/>
                        {this.state.showResetBtn && 
                            <button type="button" className="reset-btn" onClick={this.resetFormInput}>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M12.71,12l8.15,8.15l-0.71,0.71L12,12.71l-8.15,8.15l-0.71-0.71L11.29,12L3.15,3.85l0.71-0.71L12,11.29l8.15-8.15l0.71,0.71 
                                            L12.71,12z"></path>
                                </svg>
                            </button>
                        }
                        <button type="submit" className="search-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 
                                    l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z">
                                </path>
                            </svg>
                        </button>
                    </form>
                }
                {!this.state.showSmallDeviceForm && <button type="button" className="sm-form-btn" onClick={this.showForm}><i className="fas fa-search"></i></button>}
            </div>
            )
    }
}