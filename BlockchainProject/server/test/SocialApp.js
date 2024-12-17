const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("SocialApp", function() {
  let SocialApp;
  let socialApp;
  let owner;

  const NUM_TOTAL_NOT_MY_POSTS = 5;
  const NUM_TOTAL_MY_POSTS = 3;

  let totalPosts;
  let totalMyPosts;

  beforeEach(async function() {
    SocialApp = await ethers.getContractFactory("SocialApp");
    [owner, addr1, addr2] = await ethers.getSigners();
    socialApp= await SocialApp.deploy();

    totalPosts= [];
    totalMyPosts = [];

    for(let i=0; i<NUM_TOTAL_NOT_MY_POSTS; i++) {
      let post = {
        'postText': 'Random text with id:- ' + i,
        'username': addr1,
        'isDeleted': false
      };

      await socialApp.connect(addr1).addPost(post.postText, post.isDeleted);
      totalPosts.push(post);
    }

    for(let i=0; i<NUM_TOTAL_MY_POSTS; i++) {
      let post = {
        'username': owner,
        'postText': 'Ramdon text with id:- ' + (NUM_TOTAL_NOT_MY_POSTS+i),
        'isDeleted': false
      };

      await socialApp.addPost(post.postText, post.isDeleted);
      totalPosts.push(post);
      totalMyPosts.push(post);
    }
        // Adding user info for owner
        let userInfo = {
          name: "John Doe",
          bio: "Lorem ipsum dolor sit amet",
          isDeleted: false,
        };
        await socialApp.connect(owner).addInfo(userInfo.name, userInfo.bio, userInfo.isDeleted);
  });

  describe("Add Post", function() {
    it("should emit AddPost event", async function() {
      let post = {
        'postText': 'New Post',
        'isDeleted': false
      };

      await expect(await socialApp.addPost(post.postText, post.isDeleted)
    ).to.emit(socialApp, 'AddPost').withArgs(owner.address, NUM_TOTAL_NOT_MY_POSTS + NUM_TOTAL_MY_POSTS);
    })
  });

  describe("Get Posts", function() {
    it("should return the correct number of total posts", async function() {
      const postsFromChain = await socialApp.getAllPosts();
      expect(postsFromChain.length).to.equal(NUM_TOTAL_NOT_MY_POSTS + NUM_TOTAL_MY_POSTS);
    })

    it("should return the correct number of all my posts", async function() {
      const mypostsFromChain = await socialApp.getMyPosts();
      expect(mypostsFromChain.length).to.equal(NUM_TOTAL_MY_POSTS);
    })
  })

  describe("Delete Post", function() {
    it("should emit delete post event", async function() {
      const POST_ID = 0;
      const POST_DELETED = true;

      await expect(
        socialApp.connect(addr1).deletePost(POST_ID, POST_DELETED)
      ).to.emit(
        socialApp, 'DeletePost'
      ).withArgs(
        POST_ID, POST_DELETED
      );
    })
  })
  describe("Add User Info", function () {
    it("should emit AddInfo event", async function () {
      let userInfo = {
        name: "John Doe",
        bio: "Lorem ipsum dolor sit amet",
        isDeleted: false,
      };

      await expect(
        socialApp.connect(owner).addInfo(userInfo.name, userInfo.bio, userInfo.isDeleted)
      ).to.emit(socialApp, "AddInfo").withArgs(owner.address);
    });
  });
  describe("Get User Info", function () {
    it("should return correct user info", async function () {
      const userInfoFromChain = await socialApp.getInfo();
      expect(userInfoFromChain.name).to.equal("John Doe");
      expect(userInfoFromChain.bio).to.equal("Lorem ipsum dolor sit amet");
      expect(userInfoFromChain.isDeleted).to.equal(false);
    });
  });
  describe("Delete User Info", function () {
    it("should emit DeleteInfo event", async function () {
      const IS_DELETED = true;

      await expect(
        socialApp.connect(owner).deleteInfo(IS_DELETED)
      ).to.emit(socialApp, "DeleteInfo").withArgs(owner.address);
    });
  });

});