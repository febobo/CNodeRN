'use strict'

import React,{Component} from "react"
import {View,Text,TouchableHighlight,TouchableOpacity,Switch,Slider} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import NavBar from "../common/component/navbar"
import Alert from "../common/component/alert"
import Toast from "../common/component/toast"

import containerByComponent from "../lib/redux-helper"
import {clearUser} from "./action"
import {userReducer} from "./reducer"

import defaultStyles from "./stylesheet/setup"
import preferredThemer from "../common/theme"

@preferredThemer(defaultStyles)
class Setup extends Component{
    constructor(props){
        super(props)
    }
    _handleLogout(){
        const {navigationActions} = this.props
        this._alert.alert("确定退出?","",[
            {text:"取消",style:"cancel"},
            {text:"确定",onPress:()=>{
                this.props.saveAuthentication(null)
                navigationActions.resetScene()
            }}
        ])
    }
    _handleChangeTheme(enabled){
        let userPrefs = Object.assign({},this.props.userPrefs)
        userPrefs["preferredTheme"] = enabled? "dark" : "light"
        this.props.saveUserPrefs(userPrefs)
    }
    render(){
        const {userPrefs,navigationActions,styles} = this.props
        return (
            <View style={styles.container}>
            <NavBar title="设置" 
            onLeftButtonClick={navigationActions.popScene} 
            userPrefs={this.props.userPrefs}/>
            <View style={styles.setupPanel}>
                <TouchableOpacity style={[styles.setupRow,{borderBottomWidth:0.5}]}>
                    <View style={styles.setupRowLabel}>
                        <Text style={styles.setupRowLabelText}>清除缓存</Text>
                    </View>
                    <View style={styles.setupAccessory}>
                        <Text style={styles.setupAccessoryText}>无缓存</Text>
                    </View>
                </TouchableOpacity>
                <View style={[styles.setupRow,{borderBottomWidth:0.5}]}>
                    <View style={styles.setupRowLabel}>
                        <Text style={styles.setupRowLabelText}>夜间模式</Text>
                    </View>
                    <View style={styles.setupAccessory}>
                        <Switch style={{marginBottom:1}} onValueChange={this._handleChangeTheme.bind(this)} 
                        value={userPrefs && userPrefs["preferredTheme"] === "dark"}/>
                    </View>
                </View>
                <View style={[styles.setupRow,{borderBottomWidth:0.5}]}>
                    <View style={styles.setupRowLabel}>
                        <Text style={styles.setupRowLabelText}>字体大小</Text>
                    </View>
                    <View style={styles.setupRowContent}>
                        <Slider maximumValue={20} minimumValue={12}/>
                    </View>
                </View>
                <TouchableOpacity style={styles.setupRow} onPress={()=>navigationActions.pushScene("updater")}>
                    <View style={styles.setupRowLabel}>
                        <Text style={styles.setupRowLabelText}>检查更新</Text>
                    </View>
                    <View style={styles.setupAccessory}>
                        <Text style={[styles.setupRowLabelText]}><Icon name="angle-right" size={22} color="#666"/></Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.setupPanel}>
                <TouchableHighlight style={styles.setupRow} onPress={this._handleLogout.bind(this)}>
                    <Text style={[styles.setupRowLabelText,{color:"#FF3300"}]}>切换用户</Text>
                </TouchableHighlight>
            </View>
            <Alert ref={view=>this._alert=view}/>
            <Toast ref={view=>this._toast=view}/>
            </View>
        )
    }
}

export default containerByComponent(Setup,userReducer,{clearUser})