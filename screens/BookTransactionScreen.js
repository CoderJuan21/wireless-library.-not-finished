import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,TextInput,Image, Alert } from 'react-native';
import * as Permissions from 'expo-permissions'
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase'
import db from "../config"

export default class BookTransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermission:null,
            scanned:false,
           /* scannedData:'',*/
            buttonState:"normal",
            scannedBookId:'',
            scannedStudentId:'',
            transactionMessage:'',
        }
    }

getCameraPermissions=async(id)=>{
const {status}=await Permissions.askAsync(Permissions.CAMERA)
this.setState({
    hasCameraPermission:status === "granted",
    buttonState:id,
    scanned:false,
})
    }
    handleBarcodeScanned=async({type,data})=>{
        this.setState({
            scanned:true,
            scannedData:data,
            buttonState:"normal",
        })
    }

    handleTransaction=()=>{
var transactionMessage
db.collection("books").doc(this.state.scannedBookId).get()
.then((doc)=>{
    var book=doc.data()
    if(book.bookAvailability){
        this.initiateBookIssue();
        transactionMessage='Book Issued'
    }
    else{
        this.initiateBookReturn();
        transactionMessage="Book Return"
    }
})
this.setState({
    transactionMessage:transactionMessage
})
    }

    initiateBookIssue=async()=>{
        db.collection('transactions').add({
            'StudentId':this.state.scannedStudentId,
            'BookId':this.state.scannedBookId,
            'Date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'Issue'
        })
        db.collection("books").doc(this.state.scannedBookId).update({
            "bookAvailibility":false
        })  
        db.collection("students").doc(this.state.scannedStudentId).update({
            "numberOfBooksIssued":firebase.firestore.FieldValue.increment(1)
        })
        Alert.alert("Book Issued")
        this.setState({
            scannedBookId:'',
            scannedStudentId:'',
        })
    }

    initiateBookReturn=async()=>{
        db.collection('transactions').add({
            'StudentId':this.state.scannedStudentId,
            'BookId':this.state.scannedBookId,
            'Date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'Issue'
        })
        db.collection("books").doc(this.state.scannedBookId).update({
            "bookAvailibility":true
        })  
        db.collection("students").doc(this.state.scannedStudentId).update({
            "numberOfBooksIssued":firebase.firestore.FieldValue.increment(-1)
        })
        Alert.alert("Book Returned")
        this.setState({
            scannedBookId:'',
            scannedStudentId:'',
        })
    }

    render(){
const hasCameraPermission = this.state.hasCameraPermission;
const scanned = this.state.scanned;
const buttonState = this.state.buttonState;

if(buttonState!== "normal" && hasCameraPermission){
    return(
        <BarCodeScanner
        onBarCodeScanned={scanned?undefined:this.handleBarcodeScanned}>

        </BarCodeScanner>
    )
}
else if(buttonState==="normal"){
        return(
            <View style = {styles.container}>
                <View>
                <Image 
          source={require('../assets/booklogo.jpg')}
          style={{width:200,height:200}}
          ></Image>
          <Text style={{textAlign:'center',fontSize:40}}>Wireless Library</Text>
                </View>
                <View style={styles.inputView}>
                    <TextInput style={styles.inputBox}
                    placeholder="Book Id"
                    value={this.state.scannedBookId}>
                    </TextInput>
                    <TouchableOpacity style={styles.scanButton}
                    onPress={()=>{
                        this.getCameraPermissions("BookId")
                    }}>
                        <Text style={styles.buttonText}> Scan </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputView}>
                    <TextInput style={styles.inputBox}
                    placeholder="Student Id"
                    value={this.state.scannedStudentId}>
                    </TextInput>
                    <TouchableOpacity style={styles.scanButton}
                      onPress={()=>{
                        this.getCameraPermissions("StudentId")
                    }}>
                        <Text style={styles.buttonText}> Scan </Text>
                    </TouchableOpacity>
                </View>
              <TouchableOpacity style={styles.submitButton}
              onPress={async()=>(this.handleTransaction)} >
                  <Text style={styles.submitButtonText}> Submit </Text>
              </TouchableOpacity>
            </View>
        )
    }
}
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    scanButton:{
        backgroundColor:"lightblue",
        padding:10,
        margin:10,
    },
    displayText:{
        fontSize:20,
        textDecorationLine:'underline',
    },
    buttonText:{
fontSize:15,
textAlign:'center',
marginTop:10,
    },
    inputView:{
        flexDirection:'row',
        margin:20,
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:2,
        borderRightWidth:0,
        fontSize:20,
    },
    scanButton:{
        backgroundColor:"green",
        width:50,
        borderWidth:2,
    },
    submitButton:{
        backgroundColor:"green",
        width:100,
        height:50,
    },
    submitButtonText:{
        padding:10,
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold',
        color:"white",
    },
})