<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<style>
    .custom-table {
        width: 100% !important;
        table-layout: fixed;
    }

    .custom-table th,
    .custom-table td {
        word-break: break-word;
        white-space: normal;
        vertical-align: middle;
        text-align: center;
    }

    .custom-table .tleft {
        text-align: left;
    }

    .custom-table .text-center-col {
        text-align: center !important;
    }

    .table-responsive {
        overflow-x: auto;
    }
</style>

<div class="wrapper">
    <div class="content-wrapper">
        <div class="content-header">
            <h1>기술자료 파일 관리</h1>
        </div>
        <div class="content">

            <!-- 검색 영역 -->
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-search"></i> 검색</h3>
                </div>
                <form method="POST" id="frm" name="frm">
                    <input type="hidden" id="q_currPage" name="q_currPage" value="1">
                    <div class="box-body box-search">
                        <div class="form-horizontal">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label">제품구분</label>
                                        <div class="col-sm-4">
                                            <select class="form-control" name="prdGubun" id="prdGubun">
                                                <option value="">전체</option>
                                                <option value="창호"         <c:if test="${data.prdGubun == '창호'}"        >selected</c:if>>창호</option>
                                                <option value="내외장재"     <c:if test="${data.prdGubun == '내외장재'}"    >selected</c:if>>내외장재</option>
                                                <option value="보온단열재"   <c:if test="${data.prdGubun == '보온단열재'}"  >selected</c:if>>보온단열재</option>
                                                <option value="공통기술자료" <c:if test="${data.prdGubun == '공통기술자료'}">selected</c:if>>공통기술자료</option>
                                                <option value="소재"         <c:if test="${data.prdGubun == '소재'}"        >selected</c:if>>소재</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label">검색어</label>
                                        <div class="col-sm-7">
                                            <input type="text" class="form-control" id="q_searchVal"
                                                name="q_searchVal" value="${data.q_searchVal}"
                                                placeholder="파일명, 제품명, 자료제목 검색">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="box-footer clearfix">
                    <button type="button" class="btn btn-primary pull-right" onclick="moveSearch()">
                        <i class="fa fa-search"></i> 검색
                    </button>
                </div>
            </div>

            <div class="box box-primary">
                <div class="box-body">
                    <div class="post-count">
                        전체 <fmt:formatNumber value="${pager.totalNum}" pattern="#,###"/> 건
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered table-hover custom-table">
                            <colgroup>
                                <col style="width:5%">
                                <col style="width:8%">
                                <col style="width:10%">
                                <col style="width:10%">
                                <col style="width:13%">
                                <col style="width:18%">
                                <col style="width:6%">
                                <col style="width:8%">
                                <col style="width:12%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>고유번호</th>
                                    <th>대분류</th>
                                    <th>제품군</th>
                                    <th>자료유형</th>
                                    <th>대상 제품명</th>
                                    <th>파일명</th>
                                    <th>확장자</th>
                                    <th>등록일</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                            <c:choose>
                                <c:when test="${pager.totalNum == 0}">
                                    <tr>
                                        <td colspan="9">
                                            <div class="noData">검색 결과가 없습니다.</div>
                                        </td>
                                    </tr>
                                </c:when>
                                <c:otherwise>
                                    <c:forEach var="item" items="${pager.list}" varStatus="status">
                                        <tr>
                                            <td>${item.SEQ_PRD}</td>
                                            <td>${item.PRD_GUBUN}</td>
                                            <td class="text-center-col">${item.PRD_CATEGORY}</td>
                                            <td>${item.DATA_TYPE}</td>
                                            <td class="tleft">${item.PRD_NM}</td>
                                            <td class="tleft">${item.DATA_TITLE}</td>
                                            <td>${item.FILE_EXT}</td>
                                            <td>${fn:replace(item.UPDATE_DTM, ',', '')}</td>
                                            <td>
                                                <button type="button" class="btn btn-xs btn-info"
                                                    onclick="goUpdate('${item.SEQ_PRD}')">수정</button>
                                                <button type="button" class="btn btn-xs btn-danger"
                                                    onclick="goDelete('${item.SEQ_PRD}')">삭제</button>
                                                <c:choose>
                                                    <c:when test="${item.PRD_GUBUN == '소재'}">
                                                        <button type="button" class="btn btn-xs btn-default"
                                                            onclick="copyLink('/materialsDownload.do?seq=${item.SEQ_PRD}')">링크복사</button>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <button type="button" class="btn btn-xs btn-default"
                                                            onclick="copyLink('/constructionDownload.do?seq=${item.SEQ_PRD}')">링크복사</button>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </c:otherwise>
                            </c:choose>
                            </tbody>
                        </table>
                    </div>

                    <ul class="pagination pagination-sm no-margin pull-right">
                        <jsp:include page="/WEB-INF/jsp/common/pager/adminPager.jsp" flush="true">
                            <jsp:param name="script" value="movePage"/>
                        </jsp:include>
                    </ul>
                </div>
            </div>

            <div class="btn-area">
                <button type="button" class="btn btn-success"
                    onclick="location.href='/kcc_admin/prodData/insertForm.do'">
                    <i class="fa fa-plus"></i> 신규 등록
                </button>
            </div>

        </div>
    </div>
    <div class="control-sidebar-bg" style="position: fixed; height: auto;"></div>
</div>

<script>
$(document).ready(function() {
    $('#q_searchVal').on('keyup', function(key) {
        if (key.keyCode == 13) moveSearch();
    });
});

function movePage(pageNo) {
    $('#q_currPage').val(pageNo);
    $('#frm').attr('action', '/kcc_admin/prodData/list.do');
    $('#frm').submit();
}

function moveSearch() {
    $('#q_currPage').val(1);
    $('#frm').attr('action', '/kcc_admin/prodData/list.do');
    $('#frm').submit();
}

function goUpdate(seqPrd) {
    location.href = '/kcc_admin/prodData/updateForm.do?seqPrd=' + seqPrd;
}

function goDelete(seqPrd) {
    if (!confirm('삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) return;
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = '/kcc_admin/prodData/delete.do';
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'seqPrd';
    input.value = seqPrd;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

function copyLink(path) {
    var fullUrl = window.location.origin + path;
    navigator.clipboard.writeText(fullUrl).then(function() {
        alert('링크가 복사되었습니다!\n' + fullUrl);
    }).catch(function() {
        var tempInput = document.createElement('input');
        tempInput.value = fullUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('링크가 복사되었습니다!\n' + fullUrl);
    });
}
</script>