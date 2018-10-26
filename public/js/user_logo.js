$(function () {
    gitList();
    $('#btn').click(function () {
        $('.addLogo').show();
        $('.updataIphone').hide();

    })
    $('.cancle').click(function () {
        $('.addLogo').hide();
    })
    //新增按钮
    $('.add').click(function () {
        // alert(1)
        // console.log(1)
        gitList();
        var formData = new FormData();
        formData.append('iphoneBrand', $('#iphoneBrand').val());
        formData.append('iphoneImg', $('#iphoneImg')[0].files[0]);
        $.ajax({
            url: '/user_logo/add',
            method: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                console.log(result[1]);
                if (result[1].code === 0) {
                    console.log('=======================')
                    $('.addLogo').hide();
                    gitList();
                }
            },
            error: function (result) {

            }
        })
    })
})

//获取信息
var page = 1;
var pageSize = 3;
function gitList() {
    $.get('/user_logo/list', {
        page: page,
        pageSize: pageSize
    }, function (result) {
        if (result.code === 0) {
            var list = result.data.list;
            var totalPage = result.data.totalPage;
            var str = '';
            for (var i = 0; i < list.length; i++) {
                str += `
                  
                 <tr>
                    <td>${i + 1}</td>
                    <td>${list[i]._id}</td>
                    <td>${list[i].iphoneBrand}</td>
                    <td><img src='/logo/${list[i].fileName}'></td>
                    <td class="td"><a href="#" class="updata">修改</a><a href="#" class="delete">删除</a></td>
                </tr>
                `
            }
            var pageStr = '';
            for (var i = 0; i < totalPage; i++) {
                pageStr += `
                  <li data_id='${i + 1}'>${i + 1}</li>
                `
            }
            // console.log(str);
            console.log('---------------------')
            $('tbody').html(str);
            $('#uli').html(pageStr);
        }
    })
}

$('#uli').on('click', 'li', function () {
    console.log(1)
    page = $(this).attr('data_id');
    gitList();
    $(this).addClass('add');


})
//修改按钮
$('table').on('click', '.updata', function () {
    // alert(1)
    $('.updataIphone').show();
    $('.addLogo').hide();
    $('#ID').val($(this).parent().parent().find('td').eq(1).html());
    $('#phoneBrand').val($(this).parent().parent().find('td').eq(2).html());

})



//确认修改

$('.updataok').click(function () {
    $('.updataIphone').hide();
    gitList();
    var formData = new FormData();
    formData.append('ID', $('#ID').val());
    formData.append('iphoneBrand', $('#phoneBrand option:selected')
        .text());
    formData.append('iphoneImg', $('#phoneImg')[0].files[0]);

    // console.log('909090099')
    $.ajax({
        url: '/user_logo/updata',
        method: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) {
            if (result.code === 0) {
                gitList();
                console.log(result)
            }
            else {
                alert(result.msg);
            }
        },
        error: function () {
            console.log('9090770099')

        }
    })

})
$('.cancleok').click(function () {
    $('.updataIphone').hide();
})

$('.updataok').click(function () {
    $('.updataIphone').hide();
})
//删除
$('table').on('click', '.delete', function () {

    var iphoneId = $(this).parent().parent().find('td').eq(1).html();
    // alert(iphoneId)
    $.ajax({
        url: '/user_logo/delete',
        method: 'post',
        data: { 'myID': iphoneId },

        success: function (result) {
            if (result.code === 0) {
                gitList();
            }
        },
        error: function () {
        }
    })

})