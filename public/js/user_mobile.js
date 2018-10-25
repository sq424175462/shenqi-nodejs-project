
var page = 1;
var pageSize = 5;
//获取手机信息

function gitList() {
    $.get('/user_mobile/list', {
        page: page,
        pageSize: pageSize
    }, function (result) {
        // console.log(result);
        if (result.code === 0) {
            var list = result.data.list;
            var totalPage = result.data.totalPage;
            var str = '';
            for (var i = 0; i < list.length; i++) {
                str +=
                    `
                         <tr>
                            <td>${i + 1}</td>
                            <td>${list[i]._id}</td>
                            <td>${list[i].iphoneBrand}</td>
                            <td><img src='/iphoneImg/${list[i].fileName}'></td>
                            <td>${list[i].iphoneName}</td>
                            <td>${list[i].priceG}</td>
                            <td>${list[i].priceE}</td>
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
            // console.log(11111111111111111111111)
            $('tbody').html(str);
            $('#uli').html(pageStr);

        }
    })
}
$(function () {
    gitList();
    $('#btn').click(function () {
        $('.addIphone').show();
        $('.updataIphone').hide();
    })
    $('.cancle').click(function () {
        $('.addIphone').hide();
    })
    $('.add').click(function () {
        $('.updataIphone').hide();
        gitList();
        var formData = new FormData();
        formData.append('iphoneBrand', $('#iphoneBrand option:selected').text());
        formData.append('iphoneName', $('#iphoneName').val());
        formData.append('priceG', $('#priceG').val());
        formData.append('priceE', $('#priceE').val());
        formData.append('iphoneImg', $('#iphoneImg')[0].files[0]);
        $.ajax({
            url: '/user_mobile/add',
            method: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result[1].code === 0) {
                    $('.addIphone').hide();
                    gitList();
                }
            },
            error: function () {
            }
        })
    })

    //删除按钮
    $('table').on('click', '.delete', function () {
        var iphoneId = $(this).parent().parent().find('td').eq(1).html();
        // alert(iphoneId)
        $.ajax({
            url: '/user_mobile/delete',
            method: 'post',
            data: { 'myID':iphoneId},
     
            success: function (result) {
                if (result.code === 0) {
                    gitList();
                }
            },
            error: function () {
            }
        })

    })
    //修改按钮
    $('table').on('click', '.updata', function () {
        $('.updataIphone').show();
        $('.addIphone').hide();
        $('#ID').val($(this).parent().parent().find('td').eq(1).html());
        $('#phoneBrand').val($(this).parent().parent().find('td').eq(2).html());
        $('#phoneName').val($(this).parent().parent().find('td').eq(4).html());
        $('#phonepriceG').val($(this).parent().parent().find('td').eq(5).html())
        $('#phonepriceE').val($(this).parent().parent().find('td').eq(6).html());
        // $('#phoneImg').files[0].val($(this).parent().parent().find('td').eq(2).html());

    })

    //确认修改

    $('.updataok').click(function () {
        $('.updataIphone').hide();
        gitList();
        var formData = new FormData();
        formData.append('ID', $('#ID').val());
        formData.append('iphoneBrand', $('#phoneBrand option:selected').text());
        formData.append('iphoneName', $('#phoneName').val());
        formData.append('priceG', $('#phonepriceG').val());
        formData.append('priceE', $('#phonepriceE').val());
        // console.log("价格",$('#phonepriceE').val());
        $.ajax({
            url: '/user_mobile/updata',
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
            }
        })

    })
    $('.cancleok').click(function () {
        $('.updataIphone').hide();
    })
    // $('#uli').find('li').eq(0).addClass('active')
    $('#uli').on('click', 'li', function () {
        console.log(1)
        page = $(this).attr('data_id');
        gitList();
        // $(this).addClass('active');
    })
})