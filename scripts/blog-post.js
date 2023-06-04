const link = encodeURI(window.location.href);
const title = encodeURIComponent(
  document.head.querySelector("meta[property~='og:title']").content
);
const msg = encodeURIComponent("Checkout this article");

const shareButtonDiv = document.getElementById("share-buttons");
const fb = shareButtonDiv.querySelector(".facebook");
const twitter = shareButtonDiv.querySelector(".twitter");
const linkedIn = shareButtonDiv.querySelector(".linkedin");
const reddit = shareButtonDiv.querySelector(".reddit");
const whatsapp = shareButtonDiv.querySelector(".whatsapp");
const telegram = shareButtonDiv.querySelector(".telegram");

fb.href = `https://www.facebook.com/share.php?u=${link}`;
twitter.href = `http://twitter.com/share?&url=${link}&text=${msg}&hashtags=javascript,programming`;
linkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`;
reddit.href = `http://www.reddit.com/submit?url=${link}&title=${title}`;
whatsapp.href = `https://api.whatsapp.com/send?text=${msg}: ${link}`;
telegram.href = `https://telegram.me/share/url?url=${link}&text=${msg}`;
