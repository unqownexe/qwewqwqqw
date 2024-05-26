<!doctype html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
	<link href="//cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css" rel="stylesheet">
	<style>
		.new-color {
			background-color: #3CB043;
		}
	</style>
</head>
<body style="background:linear-gradient(90deg, rgba(255,255,255,1) 10%, #dcf7ffb3 74%, rgb(238 227 241 / 30%) 100%)">
    <div class="container">
        <div class="row mt-5">
            <div class="col-12 text-center mt-4">
                <h1>TemmuzAjans İndirme Servisi</h1>
                <div class="table-responsive text-light">
                    <table class="table table-hover table-striped table-borderless" id="myTable">
                        <thead>
                            <tr>
								<td style="display: none">#</td>
                                <td style="background-color: #3CB043; color: white; text-align: left">Dosya İsmi</td>
                                <td style="background-color: #3CB043; color: white; text-align: right">İşlem</td>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $klasor_yolu = "/var/www/vhosts/tiktokajansi.com/temmuzajans.com/extserver/mevcut/";
                            $dosya_listesi = glob($klasor_yolu . "/*.txt");
							$dosya_listesi = array_reverse($dosya_listesi);
                            foreach ($dosya_listesi as $k => $dosya) {
                                $dosya_adi = basename($dosya, '.txt');
								$newname = $dosya_adi.'.txt';
                            ?>
                                <tr>
									<td style="display: none"><?php echo $k + 1?></td>
                                    <td style="text-align: left"><?php echo $dosya_adi; ?></td>
                                    <td style="text-align: right"><a href="mevcut/<?php echo $newname?>" class="btn btn-primary btn-sm" download>İndir</a></td>
                                </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
	<script src="//cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
	<script>
		var table = new DataTable('#myTable', {
			language: {
				url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/tr.json',
			},
		});
	</script>
	<script>
		$(document).ready(function(){
			$("#myTable_wrapper").addClass('new-color');
		});
	</script>
</body>
</html>
