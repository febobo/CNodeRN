'use strict'
import React,{Component} from "react"
import {View,Text,ListView,TouchableOpacity,Animated,RefreshControl,Image} from "react-native"

import NavBar from "../common/component/navbar"
import Loading from "../common/component/loading"
import Anonymous from "../common/module/anonymous"

import containerByComponent from "../lib/redux-helper"
import {collectReducer} from "./reducer"
import {fetchUserCollect} from "./action"
import defaultStyles from "./stylesheet"
import preferredThemer from "../common/theme"

@preferredThemer(defaultStyles)
class UserCollect extends Component{
    constructor(props){
        super(props)
        this.state = {
            dataSource:new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            }),
            refreshing:false,
            isLogined:false
        }
    }
    componentDidMount(){
        const {user} = this.props
        if(user){
            this.setState({isLogined:true})
            this.props.actions.fetchUserCollect(user.username)
        }
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.collectFetching && nextProps.collectFetched){
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(nextProps.collects)
            })
        }
    }
    handleRefresh(){
        this.props.fetchUserCollect()
    }
    renderRow(topic){
        const {navigationActions,styles} = this.props
        return (
            <TouchableOpacity onPress={()=>navigationActions.pushScene("topic",{id:topic.id,collect:true})}>
            <Animated.View style={[styles.topicCell,{
                // opacity: this.state.rowScale,
                // transform: [{ scaleX: this.state.rowScale }]
            }]}>
                    <View style={styles.topicBreif}>
                        <Image source={{uri:topic.author.avatar_url}} style={styles.topicImage}/>
                        <View style={styles.topicSubtitle}>
                            <Text style={styles.topicSubtitleText}>{topic.author.loginname}</Text>
                            <View style={styles.topicMintitle}>
                                <Text style={[styles.topicMintitleText]}>{topic.create_at}</Text>
                                <View style={styles.topicTag}>
                                    <Text style={styles.topicTagText}>{topic.tab}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.topicAccessory}>
                            <Text style={styles.topicStatic}><Text style={styles.topicReply}>{topic.reply_count}</Text> /{topic.visit_count}</Text>
                        </View>
                    </View>
                    <View style={styles.topicTitle}>
                        <Text style={styles.topicTitleText} numberOfLines={2}>{topic.title}</Text>
                    </View>
            </Animated.View>
            </TouchableOpacity>
        )
    }
    render(){
        const {navigationActions,styles,styleConstants} = this.props
        return (
            <View style={styles.container}>
            <NavBar title="收藏的主题" leftButton={false} userPrefs={this.props.userPrefs}/>
            {!this.state.isLogined?<Anonymous toLogin={()=>navigationActions.pushScene("qrcode")}/>:this.props.collectFetching?<Loading color={styleConstants.loadingColor}/>:(
                <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true} 
                refreshControl={<RefreshControl refreshing={this.state.refreshing} title="加载中..." onRrefresh={this.handleRefresh.bind(this)}/>}
                renderSeparator={(sectionId,rowId)=><View key={`${sectionId}-${rowId}`} style={styles.cellSeparator}/>}/>
            )}
            </View>
        )
    }
}

export default containerByComponent(UserCollect,collectReducer,{fetchUserCollect})