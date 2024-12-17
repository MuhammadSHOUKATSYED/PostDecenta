// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract SocialApp {


//Events
event AddPost(address recipient, uint postId);
event DeletePost(uint postId, bool isDeleted);
event AddInfo(address recipient);
event DeleteInfo(address recipient);


struct Post{
    uint id;
    address username;
    string postText;
    bool isDeleted;
}

struct UserInfo{
    string name;
    string bio;
    bool isDeleted;
}

Post[] private posts;


//mapping of post id to the wallet address of the user
mapping(uint256 => address) postToOwner;

mapping(address => UserInfo) private users;

//method to be called by our frontend when adding a post
function addPost(string memory postText, bool isDeleted) external {
    uint postId = posts.length;
    posts.push(Post(postId, msg.sender, postText, isDeleted));
    postToOwner[postId] = msg.sender;
    emit AddPost(msg.sender, postId);

}
//method to get all posts
function getAllPosts() external view returns (Post[] memory){
    Post[] memory temporary = new Post[](posts.length);
    uint counter = 0;
    for(uint i=0;i<posts.length;i++){
        if(posts[i].isDeleted == false){
                temporary[counter] = posts[i];
                counter++;
        }
    }

    Post[] memory result = new Post[](counter);
    for(uint i=0;i<posts.length;i++){
        if(posts[i].isDeleted == false){
                result[i] = temporary[i];
        }
    }
    return result;

}
//method to get my posts
function getMyPosts() external view returns (Post[] memory){
    Post[] memory temporary = new Post[](posts.length);
    uint counter = 0;
    for(uint i=0;i<posts.length;i++){
        if(postToOwner[i] == msg.sender && posts[i].isDeleted == false){
                temporary[counter] = posts[i];
                counter++;
        }
    }

    Post[] memory result = new Post[](counter);
    for(uint i=0;i<counter;i++){
                result[i] = temporary[i];
    }
    return result;

}
//Method to Delete a Post
function deletePost(uint postId, bool isDeleted) external {
    if(postToOwner[postId] == msg.sender){
        posts[postId].isDeleted = isDeleted;
        emit DeletePost(postId, isDeleted);
    }
}
//Method to Add User's Info
function addInfo(string memory name, string memory bio, bool isDeleted) external {
        users[msg.sender] = UserInfo(name, bio, isDeleted);
        emit AddInfo(msg.sender);
}
//Method to Delete User's Info
    function deleteInfo(bool isDeleted) external {
        users[msg.sender].isDeleted = isDeleted;
        emit DeleteInfo(msg.sender);
}
//Method to Get User's Info
   function getInfo() external view returns (string memory name, string memory bio, bool isDeleted) {
        UserInfo memory user = users[msg.sender];
        if(!user.isDeleted){
            return (user.name, user.bio, user.isDeleted);
        }
    }

}