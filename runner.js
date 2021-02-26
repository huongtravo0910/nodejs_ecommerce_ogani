const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cartRoute = require("./controllers/cartRoute");
const authRoute = require("./controllers/authRoute");
const productRoute = require("./controllers/productRoute");
const invoiceRoute = require("./controllers/invoiceRoute");
const chartRoute = require("./controllers/chartRoute");

const app = express();

function messageAlert(message) {
  if (message) {
    return `<div class="alert alert-danger" role="alert">${message}</div>`;
  }
  return "";
}

function checkLoginToChangePassword(session) {
  if (session) {
    return '<a style="font-size: 14px;color: #1c1c1c" href="/auth/change">Change password</a>';
  }
  return '';
}

function checkLogin(session) {
  if (session) {
    return '<a href="/auth/logout"><i class="fa fa-user"></i> Logout</a>';
  }
  return '<a href="/auth/login"><i class="fa fa-user"></i>Login</a>';
}

function formatCurrency(c) {
  return c.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function pagination(url, n, p) {
  if (n > 2) {
    let a = ['<ul style="margin-bottom: 20px; color: green" class="pagination">'];
    const slot = 3;
    const mid = Math.ceil(slot / 2);
    let left = 1,
      right = slot;
    if (p > mid) {
      right = p + mid - 1;
      if (right > n) {
        right = n;
      }
      left = right - slot + 1;
    }
    for (let i = left; i <= right; i++) {
      if (i == p) {
        a.push('<li style="background-color: green" class="active page-item">');
      } else {
        a.push('<li style="color: green" class="page-item">');
      }
      a.push(`<a class="page-link" href="${url.format(i)}">${i}</a>`);
      a.push("</li>");
    }
    a.push("</ul>");
    return a.join("");
  }
    return ""
}

String.prototype.format = function () {
  const a = arguments;
  return this.replace(/{(\d+)}/g, (m, i) => {
    return a[i];
  });
};

app.engine(
  "html",
  handlebars({
    extname: ".html",
    helpers: {
      messageAlert: messageAlert,
      checkLogin: checkLogin,
      checkLoginToChangePassword:checkLoginToChangePassword,
      formatCurrency: formatCurrency,
      pagination: pagination,
    },
  })
);
app.set("view engine", "html");
app.use(express.static("static"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use("/cart", cartRoute);
app.use("/invoice", invoiceRoute);
app.use("/auth", authRoute);
app.use("/chart", chartRoute);
app.use("/", productRoute);

app.listen(5000, () => {
  console.log("Server started at localhost:5000");
});
