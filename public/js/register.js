var userReg = /^\w{3,8}$/;
var pwdReg = /^\S{3,8}$/;
// 用户名正则
var useflag = false;
$('#btn_1').attr('disabled', true);

$('.usernameinfo').focus(function () {
    $('.user_info').css('display', 'block');
    $('.user_err').css('display', 'none');
    $('.user_success').css('display', 'none');
})
$('.usernameinfo').blur(function () {
    $('.user_info').css('display', 'none');
    if (userReg.test($(this).val())) {
        $('.user_success').css('display', 'block');
    } else {
        $('.user_err').css('display', 'block');
    }
})
// 密码正则
var pwdflag = false;
$('.pwdinfo').focus(function () {
    $('.pwd_info').css('display', 'block');
    $('.pwd_err').css('display', 'none');
    $('.pwd_success').css('display', 'none');
})
$('.pwdinfo').blur(function () {
    $('.pwd_info').css('display', 'none');

    if (pwdReg.test($(this).val())) {
        $('.pwd_success').css('display', 'block');
    } else {
        $('.pwd_err').css('display', 'block');
    }
})
//再次密码正则
var repwdflag = false;
$('.repwdinfo').focus(function () {
    $('.repwd_pwd').css('display', 'block');
    $('.repwd_err').css('display', 'none');
    $('.repwd_success').css('display', 'none');
})
$('.repwdinfo').blur(function () {
    $('.repwd_pwd').css('display', 'none');
    if ($('.pwdinfo').val() != '') {
        if ($('.pwdinfo').val() == $(this).val()) {
            $('.repwd_success').css('display', 'block');
        } else {
            $('.repwd_err').css('display', 'block');
        }
    }
})

//登录操作
$(document).click(function () {
    if (userReg.test($('.usernameinfo').val())) {
        useflag = true;
    } else {
        useflag = false;
    }
    if (pwdReg.test($('.pwdinfo').val())) {
        pwdflag = true;
    } else {
        pwdflag = false;
    }
    if ($('.pwdinfo').val() == $('.repwdinfo').val()) {
        repwdflag = true;
    } else {
        repwdflag = false;
    }

    if (useflag && pwdflag && repwdflag) {
        $('#btn_1').attr('disabled', false)
    } else {
        $('#btn_1').attr('disabled', true);
    }
})