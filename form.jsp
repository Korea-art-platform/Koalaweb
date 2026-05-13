<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<div class="wrapper">
    <div class="content-wrapper">
        <div class="content-header">
            <h1>기술자료 파일
                <c:choose>
                    <c:when test="${data != null}">수정</c:when>
                    <c:otherwise>등록</c:otherwise>
                </c:choose>
            </h1>
        </div>
        <div class="content">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">파일 정보 입력</h3>
                </div>

                <form method="POST" id="frm" name="frm" enctype="multipart/form-data">
                <c:if test="${data != null}">
                    <input type="hidden" name="seqPrd" value="${data.SEQ_PRD}">
                </c:if>

                <div class="box-body">
                    <div class="form-horizontal">

                        <!-- 대분류 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">
                                대분류 <span class="text-danger">*</span>
                            </label>
                            <div class="col-sm-4">
                                <select class="form-control" name="prdGubun" id="prdGubun">
                                    <option value="">선택</option>
                                    <option value="창호"         <c:if test="${data.PRD_GUBUN == '창호'}"        >selected</c:if>>창호</option>
                                    <option value="내외장재"     <c:if test="${data.PRD_GUBUN == '내외장재'}"    >selected</c:if>>내외장재</option>
                                    <option value="보온단열재"   <c:if test="${data.PRD_GUBUN == '보온단열재'}"  >selected</c:if>>보온단열재</option>
                                    <option value="공통기술자료" <c:if test="${data.PRD_GUBUN == '공통기술자료'}">selected</c:if>>공통기술자료</option>
                                    <option value="소재"         <c:if test="${data.PRD_GUBUN == '소재'}"        >selected</c:if>>소재</option>
                                </select>
                            </div>
                        </div>

                        <!-- 제품군 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">제품군</label>
                            <div class="col-sm-4">
                                <select class="form-control" name="prdCategory" id="prdCategory">
                                    <option value="">선택</option>
                                    <!-- 창호 -->
                                    <option value="일반창호"   class="opt_창호" style="display:none;" <c:if test="${data.PRD_CATEGORY == '일반창호'}"  >selected</c:if>>일반창호</option>
                                    <option value="발코니창호" class="opt_창호" style="display:none;" <c:if test="${data.PRD_CATEGORY == '발코니창호'}">selected</c:if>>발코니창호</option>
                                    <option value="시스템창호" class="opt_창호" style="display:none;" <c:if test="${data.PRD_CATEGORY == '시스템창호'}">selected</c:if>>시스템창호</option>
                                    <option value="klenze"     class="opt_창호" style="display:none;" <c:if test="${data.PRD_CATEGORY == 'klenze'}"    >selected</c:if>>klenze</option>
                                    <!-- 내외장재 -->
                                    <option value="내외장재"        class="opt_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY == '내외장재'}"       >selected</c:if>>내외장재</option>
                                    <option value="석고보드 시스템" class="opt_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY == '석고보드 시스템'}">selected</c:if>>석고보드 시스템</option>
                                    <option value="천장재 시스템"   class="opt_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY == '천장재 시스템'}"  >selected</c:if>>천장재 시스템</option>
                                    <!-- 보온단열재 -->
                                    <option value="그라스울"         class="opt_보온단열재" style="display:none;" <c:if test="${data.PRD_CATEGORY == '그라스울'}"        >selected</c:if>>그라스울</option>
                                    <option value="그라스울 네이처"  class="opt_보온단열재" style="display:none;" <c:if test="${data.PRD_CATEGORY == '그라스울 네이처'}" >selected</c:if>>그라스울 네이처</option>
                                    <option value="그라스울(외단열)" class="opt_보온단열재" style="display:none;" <c:if test="${data.PRD_CATEGORY == '그라스울(외단열'}">selected</c:if>>그라스울(외단열)</option>
                                    <option value="미네랄울"         class="opt_보온단열재" style="display:none;" <c:if test="${data.PRD_CATEGORY == '미네랄울'}"        >selected</c:if>>미네랄울</option>
                                    <option value="미네랄울(외단열)" class="opt_보온단열재" style="display:none;" <c:if test="${data.PRD_CATEGORY == '미네랄울(외단열)'}" >selected</c:if>>미네랄울(외단열)</option>
                                    <option value="세라크울"         class="opt_보온단열재" style="display:none;" <c:if test="${data.PRD_CATEGORY == '세라크울'}"        >selected</c:if>>세라크울</option>
                                    <!-- 공통기술자료 -->
                                    <option value="내외장재" class="opt_공통기술자료" style="display:none;" <c:if test="${data.PRD_CATEGORY == '내외장재'}">selected</c:if>>내외장재</option>
                                </select>
                            </div>
                        </div>

                        <!-- 제품 종류 (하위제품군) -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">제품 종류</label>
                            <div class="col-sm-4">
                                <select class="form-control" name="prdCategorySub" id="prdCategorySub">
                                    <option value="">선택</option>
                                    <!-- 창호 > 일반창호 -->
                                    <option value="단창"           class="sub_일반창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '단창'}"          >selected</c:if>>단창</option>
                                    <option value="이중창"         class="sub_일반창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '이중창'}"        >selected</c:if>>이중창</option>
                                    <option value="터닝도어"       class="sub_일반창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '터닝도어'}"      >selected</c:if>>터닝도어</option>
                                    <option value="프로젝트창"     class="sub_일반창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '프로젝트창'}"    >selected</c:if>>프로젝트창</option>
                                    <!-- 창호 > 발코니창호 -->
                                    <option value="단창"           class="sub_발코니창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '단창'}"              >selected</c:if>>단창</option>
                                    <option value="이중창"         class="sub_발코니창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '이중창'}"            >selected</c:if>>이중창</option>
                                    <option value="입면분할단창"   class="sub_발코니창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '입면분할단창'}"      >selected</c:if>>입면분할단창</option>
                                    <option value="입면분할이중창" class="sub_발코니창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '입면분할이중창'}"    >selected</c:if>>입면분할이중창</option>
                                    <!-- 창호 > 시스템창호 -->
                                    <option value="Lift &amp; Sliding" class="sub_시스템창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == 'Lift & Sliding'}">selected</c:if>>Lift &amp; Sliding</option>
                                    <option value="Tilt &amp; Turn"    class="sub_시스템창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == 'Tilt & Turn'}"   >selected</c:if>>Tilt &amp; Turn</option>
                                    <option value="Parallel &amp; Sliding" class="sub_시스템창호" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == 'Parallel & Sliding'}">selected</c:if>>Parallel &amp; Sliding</option>
                                    <!-- 창호 > klenze -->
                                    <option value="Klenze M-Series" class="sub_klenze" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == 'Klenze M-Series'}">selected</c:if>>Klenze M-Series</option>
                                    <option value="Klenze Z-Series" class="sub_klenze" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == 'Klenze Z-Series'}">selected</c:if>>Klenze Z-Series</option>
                                    <option value="Klenze Option"   class="sub_klenze" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == 'Klenze Option'}"  >selected</c:if>>Klenze Option</option>
                                    <!-- 내외장재 > 내외장재 -->
                                    <option value="석고보드"           class="sub_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '석고보드'}"          >selected</c:if>>석고보드</option>
                                    <option value="석고본드"           class="sub_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '석고본드'}"          >selected</c:if>>석고본드</option>
                                    <option value="석고텍스 PLUS"      class="sub_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '석고텍스 PLUS'}"     >selected</c:if>>석고텍스 PLUS</option>
                                    <option value="마이톤"             class="sub_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '마이톤'}"            >selected</c:if>>마이톤</option>
                                    <option value="마이텍스"           class="sub_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '마이텍스'}"          >selected</c:if>>마이텍스</option>
                                    <option value="고급 천장재"        class="sub_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '고급 천장재'}"       >selected</c:if>>고급 천장재</option>
                                    <option value="뷰티클"             class="sub_내외장재" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '뷰티클'}"            >selected</c:if>>뷰티클</option>
                                    <!-- 내외장재 > 석고보드 시스템 -->
                                    <option value="일반구조체"         class="sub_석고보드 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '일반구조체'}"        >selected</c:if>>일반구조체</option>
                                    <option value="내화구조체"         class="sub_석고보드 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '내화구조체'}"        >selected</c:if>>내화구조체</option>
                                    <option value="내화차음구조체"     class="sub_석고보드 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '내화차음구조체'}"    >selected</c:if>>내화차음구조체</option>
                                    <option value="지하차수벽시스템"   class="sub_석고보드 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '지하차수벽시스템'}"  >selected</c:if>>지하차수벽시스템</option>
                                    <!-- 내외장재 > 천장재 시스템 -->
                                    <option value="석고보드 천장시스템"   class="sub_천장재 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '석고보드 천장시스템'}"  >selected</c:if>>석고보드 천장시스템</option>
                                    <option value="석고텍스 PLUS"         class="sub_천장재 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '석고텍스 PLUS'}"       >selected</c:if>>석고텍스 PLUS</option>
                                    <option value="마이톤"                class="sub_천장재 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '마이톤'}"               >selected</c:if>>마이톤</option>
                                    <option value="마이텍스"              class="sub_천장재 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '마이텍스'}"             >selected</c:if>>마이텍스</option>
                                    <option value="고급 천장재"           class="sub_천장재 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '고급 천장재'}"          >selected</c:if>>고급 천장재</option>
                                    <option value="마이톤 스카이"         class="sub_천장재 시스템" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '마이톤 스카이'}"        >selected</c:if>>마이톤 스카이</option>
                                    <!-- 보온단열재 > 그라스울 -->
                                    <option value="크린판넬"       class="sub_그라스울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '크린판넬'}"      >selected</c:if>>크린판넬</option>
                                    <option value="보온통(린카바/쉘코바)" class="sub_그라스울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '보온통(린카바/쉘코바)'}">selected</c:if>>보온통(린카바/쉘코바)</option>
                                    <!-- 보온단열재 > 그라스울 네이처 -->
                                    <option value="크린보드"       class="sub_그라스울 네이처" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '크린보드'}"      >selected</c:if>>크린보드</option>
                                    <option value="크린매트"       class="sub_그라스울 네이처" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '크린매트'}"      >selected</c:if>>크린매트</option>
                                    <option value="크란롤"         class="sub_그라스울 네이처" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '크란롤'}"        >selected</c:if>>크란롤</option>
                                    <option value="흡음보드"       class="sub_그라스울 네이처" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '흡음보드'}"      >selected</c:if>>흡음보드</option>
                                    <option value="레실라인트"     class="sub_그라스울 네이처" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '레실라인트'}"    >selected</c:if>>레실라인트</option>
                                    <!-- 보온단열재 > 그라스울(외단열) -->
                                    <option value="위터세이프"     class="sub_그라스울(외단열)" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '위터세이프'}"    >selected</c:if>>위터세이프</option>
                                    <!-- 보온단열재 > 미네랄울 -->
                                    <option value="미네랄울 보드"         class="sub_미네랄울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '미네랄울 보드'}"        >selected</c:if>>미네랄울 보드</option>
                                    <option value="미네랄울 벨트"         class="sub_미네랄울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '미네랄울 벨트'}"        >selected</c:if>>미네랄울 벨트</option>
                                    <option value="미네랄울 보온통"       class="sub_미네랄울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '미네랄울 보온통'}"      >selected</c:if>>미네랄울 보온통</option>
                                    <option value="미네랄울 블랭킷"       class="sub_미네랄울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '미네랄울 블랭킷'}"      >selected</c:if>>미네랄울 블랭킷</option>
                                    <option value="미네랄울 루즈울"       class="sub_미네랄울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '미네랄울 루즈울'}"      >selected</c:if>>미네랄울 루즈울</option>
                                    <!-- 보온단열재 > 미네랄울(외단열) -->
                                    <option value="외단열 미네랄울"       class="sub_미네랄울(외단열)" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '외단열 미네랄울'}">selected</c:if>>외단열 미네랄울</option>
                                    <!-- 보온단열재 > 세라크울 -->
                                    <option value="세라믹섬유 블랭킷"     class="sub_세라크울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '세라믹섬유 블랭킷'}"    >selected</c:if>>세라믹섬유 블랭킷</option>
                                    <option value="세라크울 New-Bio α 1200" class="sub_세라크울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '세라크울 New-Bio α 1200'}">selected</c:if>>세라크울 New-Bio α 1200</option>
                                    <option value="세라크울 New-Bio 1260" class="sub_세라크울" style="display:none;" <c:if test="${data.PRD_CATEGORY_SUB == '세라크울 New-Bio 1260'}">selected</c:if>>세라크울 New-Bio 1260</option>
                                </select>
                            </div>
                        </div>

                        <!-- 자료유형 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">
                                자료유형 <span class="text-danger">*</span>
                            </label>
                            <div class="col-sm-4">
                                <select class="form-control" name="dataType" id="dataType">
                                    <option value="">선택</option>
                                    <option value="성적서"         <c:if test="${data.DATA_TYPE == '성적서'}"        >selected</c:if>>성적서</option>
                                    <option value="도면"           <c:if test="${data.DATA_TYPE == '도면'}"          >selected</c:if>>도면</option>
                                    <option value="인증서"         <c:if test="${data.DATA_TYPE == '인증서'}"        >selected</c:if>>인증서</option>
                                    <option value="카다로그"       <c:if test="${data.DATA_TYPE == '카다로그'}"      >selected</c:if>>카다로그</option>
                                    <option value="시방서"         <c:if test="${data.DATA_TYPE == '시방서'}"        >selected</c:if>>시방서</option>
                                    <option value="시공사례"       <c:if test="${data.DATA_TYPE == '시공사례'}"      >selected</c:if>>시공사례</option>
                                    <option value="인정서"         <c:if test="${data.DATA_TYPE == '인정서'}"        >selected</c:if>>인정서</option>
                                    <option value="MSDS"           <c:if test="${data.DATA_TYPE == 'MSDS'}"          >selected</c:if>>MSDS</option>
                                    <option value="건축법규"       <c:if test="${data.DATA_TYPE == '건축법규'}"      >selected</c:if>>건축법규</option>
                                    <option value="시험성과대비표" <c:if test="${data.DATA_TYPE == '시험성과대비표'}">selected</c:if>>시험성과대비표</option>
                                    <option value="자재승인서류"   <c:if test="${data.DATA_TYPE == '자재승인서류'}"  >selected</c:if>>자재승인서류</option>
                                    <option value="기술자료집"     <c:if test="${data.DATA_TYPE == '기술자료집'}"    >selected</c:if>>기술자료집</option>
                                </select>
                            </div>
                        </div>

                        <!-- 태그1 인증구분 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">태그1 인증 등</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="dataAttr1"
                                    value="${data.DATA_ATTR_1}"
                                    placeholder="예: 납세증명서, 자재승인서, 한국산업규격표지 등">
                            </div>
                        </div>

                        <!-- 태그2 지역 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">태그2 공장 등</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="dataAttr2"
                                    value="${data.DATA_ATTR_2}"
                                    placeholder="예: 대죽, 김천, 여천 등">
                            </div>
                        </div>

                        <!-- 태그3 취득년월 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">
                                태그3 취득년월 등 <span class="text-danger">*</span>
                            </label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="dataAttr3" id="dataAttr3"
                                    value="${fn:replace(data.DATA_ATTR_3, ',', '')}"
                                    placeholder="예: 2024.01" maxlength="8">
                                <p class="help-block">※ 연도.월 형식으로 꼭 입력해주세요 (예: 2024.01)</p>
                            </div>
                        </div>

                        <!-- 유효기간 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">유효기간</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="valid" id="valid"
                                    value="${fn:replace(data.VALID, ',', '')}"
                                    placeholder="예: 2025.12" maxlength="8">
                                <p class="help-block">※ 연도.월 형식으로 입력해주세요 (예: 2025.12)</p>
                            </div>
                        </div>

                        <!-- 업데이트 일자 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">업데이트 일자</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="updateDtm" id="updateDtm"
                                    value="${fn:replace(data.UPDATE_DTM, ',', '')}"
                                    placeholder="예: 20260317" maxlength="8">
                                <p class="help-block">※ YYYYMMDD 형식으로 입력해주세요 (예: 20260317)</p>
                            </div>
                        </div>

                        <!-- 대상 제품명 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">
                                대상 제품명 <span class="text-danger">*</span>
                            </label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="prdNm" id="prdNm"
                                    value="${data.PRD_NM}" placeholder="대상 제품명을 입력해주세요">
                            </div>
                        </div>

                        <!-- 자료 제목 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">
                                자료 제목 <span class="text-danger">*</span>
                            </label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control" name="dataTitle" id="dataTitle"
                                    value="${data.DATA_TITLE}" placeholder="파일 선택 시 자동 입력됩니다">
                            </div>
                        </div>

                        <!-- 파일 업로드 -->
                        <div class="form-group" id="uploadFileGroup">
                            <label class="col-sm-2 control-label">
                                파일 업로드
                                <c:if test="${data == null}">
                                    <span class="text-danger">*</span>
                                </c:if>
                            </label>
                            <div class="col-sm-6">
                                <input type="file" name="uploadFile" id="uploadFile"
                                    class="form-control" accept=".dwg,.DWG,.PDF,.pdf">
                                <span id="dupFileMsg" class="text-danger" style="display:none; font-size:12px;">
                                    <i class="fa fa-warning"></i> 동일한 파일명이 존재합니다. 파일명을 변경해서 올려주세요.
                                </span>
                                <c:if test="${data != null}">
                                    <p class="help-block">
                                        현재 파일: <strong>${data.FILE_NM}.${data.FILE_EXT}</strong>
                                        (새 파일 선택 시 교체됩니다)
                                    </p>
                                </c:if>
                                <p class="help-block text-danger">
                                    ※ 파일명은 자동으로 암호화되어 저장됩니다.
                                </p>
                            </div>
                        </div>

                        <!-- 특성 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">특성</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="characteristic"
                                    value="${data.CHARACTERISTIC}" placeholder="예: 고강도, 유공흡음 등">
                            </div>
                        </div>

                        <!-- 두께 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">두께</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="thickness"
                                    value="${data.THICKNESS}" placeholder="예: 9.5T">
                            </div>
                        </div>

                        <!-- 사이즈 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">사이즈</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="size"
                                    value="${data.SIZE}" placeholder="예: 300*600">
                            </div>
                        </div>

                        <!-- 타입 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">타입</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="type"
                                    value="${fn:replace(data.TYPE, ',', '')}">
                            </div>
                        </div>

                        <!-- 내화인정시간 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">내화인정시간</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control"
                                    name="fireResistanceRecognitionTime"
                                    value="${data.FIRE_RESISTANCE_RECOGNITION_TIME}"
                                    placeholder="예: 2시간, 1시간 등">
                            </div>
                        </div>

                        <!-- 바타입 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">바타입</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="barType"
                                    value="${data.BAR_TYPE}" placeholder="예: M-BAR">
                            </div>
                        </div>

                        <!-- 밀도 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">밀도</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="density"
                                    value="${data.DENSITY}" placeholder="예: 80K, 1호 2호">
                            </div>
                        </div>

                        <!-- 규격 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">규격</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="standard"
                                    value="${fn:replace(data.STANDARD, ',', '')}">
                            </div>
                        </div>

                        <!-- 설명 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">설명</label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control" name="description"
                                    value="${data.DESCRIPTION}">
                            </div>
                        </div>

                    </div>
                </div>

                <div class="box-footer">
                    <button type="button" class="btn btn-default"
                        onclick="location.href='/kcc_admin/prodData/list.do'">
                        <i class="fa fa-list"></i> 목록
                    </button>
                    <button type="button" class="btn btn-primary pull-right" onclick="goSave()">
                        <i class="fa fa-save"></i>
                        <c:choose>
                            <c:when test="${data != null}">수정</c:when>
                            <c:otherwise>등록</c:otherwise>
                        </c:choose>
                    </button>
                </div>

                </form>
            </div>
        </div>
    </div>
    <div class="control-sidebar-bg" style="position: fixed; height: auto;"></div>
</div>
<script>
var isInsert = "${data == null ? 'true' : 'false'}";
var isDupFile = false;

// 제품군-제품종류 매핑 데이터
var subCategoryMap = {
    '일반창호'        : ['단창', '이중창', '터닝도어', '프로젝트창'],
    '발코니창호'      : ['단창', '이중창', '입면분할단창', '입면분할이중창'],
    '시스템창호'      : ['Lift & Sliding', 'Tilt & Turn', 'Parallel & Sliding'],
    'klenze'          : ['Klenze M-Series', 'Klenze Z-Series', 'Klenze Option'],
    '내외장재'        : ['석고보드', '석고본드', '석고텍스 PLUS', '마이톤', '마이텍스', '고급 천장재', '뷰티클'],
    '석고보드 시스템' : ['일반구조체', '내화구조체', '내화차음구조체', '지하차수벽시스템'],
    '천장재 시스템'   : ['석고보드 천장시스템', '석고텍스 PLUS', '마이톤', '마이텍스', '고급 천장재', '마이톤 스카이'],
    '그라스울'        : ['크린판넬', '보온통(린카바/쉘코바)'],
    '그라스울 네이처' : ['크린보드', '크린매트', '크란롤', '흡음보드', '레실라인트'],
    '그라스울(외단열)': ['위터세이프'],
    '미네랄울'        : ['미네랄울 보드', '미네랄울 벨트', '미네랄울 보온통', '미네랄울 블랭킷', '미네랄울 루즈울'],
    '미네랄울(외단열)': ['외단열 미네랄울'],
    '세라크울'        : ['세라믹섬유 블랭킷', '세라크울 New-Bio α 1200', '세라크울 New-Bio 1260']
};

function updateSubCategory(selectedCategory, selectedSub) {
    var prdCategorySub = document.getElementById('prdCategorySub');
    var options = prdCategorySub.querySelectorAll('option');
    options.forEach(function(opt) {
        if (opt.value === '') return;
        opt.style.display = 'none';
    });
    prdCategorySub.value = '';

    if (selectedCategory && subCategoryMap[selectedCategory]) {
        var subList = subCategoryMap[selectedCategory];
        var showClass = 'sub_' + selectedCategory;
        var targets = prdCategorySub.querySelectorAll('.' + showClass);
        targets.forEach(function(opt) {
            opt.style.display = '';
        });
        if (selectedSub) {
            prdCategorySub.value = selectedSub;
        }
    }
}

// 대분류 변경 시 제품군 동적 변경
document.getElementById('prdGubun').addEventListener('change', function() {
    var prdGubun = this.value;
    var prdCategory = document.getElementById('prdCategory');
    var options = prdCategory.querySelectorAll('option');
    options.forEach(function(opt) {
        if (opt.value === '') return;
        opt.style.display = 'none';
    });
    prdCategory.value = '';

    // 제품종류도 초기화
    var prdCategorySub = document.getElementById('prdCategorySub');
    var subOptions = prdCategorySub.querySelectorAll('option');
    subOptions.forEach(function(opt) {
        if (opt.value === '') return;
        opt.style.display = 'none';
    });
    prdCategorySub.value = '';

    if (prdGubun !== '') {
        var showClass = 'opt_' + prdGubun;
        var targets = prdCategory.querySelectorAll('.' + showClass);
        targets.forEach(function(opt) {
            opt.style.display = '';
        });
    }
});

// 제품군 변경 시 제품종류 동적 변경
document.getElementById('prdCategory').addEventListener('change', function() {
    updateSubCategory(this.value, '');
});

// 페이지 로드 시 수정화면에서 기존 값 유지
(function() {
    var prdGubun = document.getElementById('prdGubun').value;
    if (prdGubun === '') return;

    var prdCategory = document.getElementById('prdCategory');
    var options = prdCategory.querySelectorAll('option');
    options.forEach(function(opt) {
        if (opt.value === '') return;
        opt.style.display = 'none';
    });
    var showClass = 'opt_' + prdGubun;
    var targets = prdCategory.querySelectorAll('.' + showClass);
    targets.forEach(function(opt) {
        opt.style.display = '';
    });

    var selectedCategory = prdCategory.value;
    var selectedSub = '${data.PRD_CATEGORY_SUB}';
    updateSubCategory(selectedCategory, selectedSub);
})();

document.getElementById('uploadFile').addEventListener('change', function() {
    if (this.files.length > 0) {
        var file = this.files[0];
        var fileName = file.name;
        var fileExt = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        if (fileExt !== 'pdf' && fileExt !== 'dwg') {
            alert("PDF와 DWG만 가능합니다");
            this.value = '';
            document.getElementById('dataTitle').value = '';
            return false;
        }

        var fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        var fileNmForCheck = fileNameWithoutExt
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        var seqPrd = "${data.SEQ_PRD != null ? data.SEQ_PRD : ''}";

        $.ajax({
            url: '/kcc_admin/prodData/checkDupFileNm.do',
            type: 'POST',
            data: { fileNm: fileNmForCheck, seqPrd: seqPrd },
            dataType: 'json',
            success: function(result) {
                if (result.dupCnt > 0) {
                    isDupFile = true;
                    document.getElementById('uploadFile').style.borderColor = 'red';
                    document.getElementById('dupFileMsg').style.display = 'block';
                } else {
                    isDupFile = false;
                    document.getElementById('uploadFile').style.borderColor = '';
                    document.getElementById('dupFileMsg').style.display = 'none';

                    var dataTitleInput = document.getElementById('dataTitle');
                    if (dataTitleInput.value.trim() == '') {
                        dataTitleInput.value = fileNameWithoutExt;
                    }
                }
            },
            error: function(xhr, status, error) {
                alert('중복 체크 중 오류가 발생하였습니다.');
            }
        });
    }
});

function convertToCommaFormat(inputEl) {
    if (inputEl.value.trim() != '') {
        var val = inputEl.value.replace(',', '');
        var parts = val.split('.');
        if (parts.length == 2) {
            var year = parseInt(parts[0]).toLocaleString('en-US');
            inputEl.value = year + '.' + parts[1];
        }
    }
}

function goSave() {
    var prdGubun   = document.getElementById('prdGubun').value;
    var dataType   = document.getElementById('dataType').value;
    var dataTitle  = document.getElementById('dataTitle').value;
    var prdNm      = document.getElementById('prdNm').value;
    var uploadFile = document.getElementById('uploadFile').files;
    var fileName   = uploadFile.length > 0 ? uploadFile[0].name : '(파일 없음)';

    if (prdGubun == '') {
        alert('제품구분을 선택해주세요.');
        document.getElementById('prdGubun').focus();
        return;
    }
    if (dataType == '') {
        alert('자료유형을 선택해주세요.');
        document.getElementById('dataType').focus();
        return;
    }
    if (dataTitle.trim() == '') {
        alert('자료제목을 입력해주세요.');
        document.getElementById('dataTitle').focus();
        return;
    }
    if (prdNm.trim() == '') {
        alert('대상 제품명을 입력해주세요.');
        document.getElementById('prdNm').focus();
        return;
    }
    if (isInsert === 'true' && (uploadFile == null || uploadFile.length == 0)) {
        alert('파일을 선택해주세요.');
        return;
    }
    if (isDupFile) {
        document.getElementById('uploadFile').style.borderColor = 'red';
        document.getElementById('dupFileMsg').style.display = 'block';
        document.getElementById('uploadFile').focus();
        return;
    }

    convertToCommaFormat(document.getElementById('dataAttr3'));

    var confirmMsg = '아래 내용으로 등록하시겠습니까?\n\n'
        + '■ 제품구분 : ' + prdGubun + '\n'
        + '■ 자료유형 : ' + dataType + '\n'
        + '■ 대상제품명 : ' + prdNm + '\n'
        + '■ 자료제목 : ' + dataTitle + '\n'
        + '■ 업로드파일 : ' + fileName + '\n\n'
        + '등록을 진행하시겠습니까?';

    if (!confirm(confirmMsg)) return;

    var frm = document.getElementById('frm');
    var isDataExist = "${data != null ? 'true' : 'false'}";

    if (isDataExist === 'true') {
        frm.action = '/kcc_admin/prodData/update.do';
    } else {
        frm.action = '/kcc_admin/prodData/insert.do';
    }

    frm.submit();
}
</script>