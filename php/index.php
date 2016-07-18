<?php
require_once('functions.php');

if(trim($_GET['cmd'])!=''){
    $response = array();
    switch($_GET['cmd']){

        case 'model':

            $query = 'SELECT * FROM '.addslashes($_GET['table']).' WHERE id=\''.addslashes($_GET['id']).'\' LIMIT 1';
            $result = execQuery($query);
            $response['row'] = $result['rows'][0];

            break;

        case 'list':
            $query = 'SELECT * FROM '.addslashes($_GET['table']).' WHERE '.addslashes($_GET['originField']).'='.addslashes($_GET['originValue']);
            $queryOri = $query;

            //process the sql tree
            $sql2tree = new dqml2tree($query);
            $sqlTree = $sql2tree->make();

            //count the total query rows before adding limit
            $count = countQuery($query,$sqlTree);

            //limit the query and execute
            makeLimitedQuery($query,$sqlTree);
            $result = execQuery($query);

            $result['countTotal'] = $count;
            $result['countTotal_formated'] = number_format($count, 0, ',', ' ');

            $response['rows'] = $result['rows'];
            break;

        case 'tables':

            //get all tables
            $tables = getDatabaseTables();
            $tables_flat = array_keys($tables);//perf
            $contextMenu=array();

            //get description for every table
            foreach($tables as $table=>$v){
                $tables[$table] = getTableDescription($table);
                $listFields = array();

                foreach($tables[$table]['__fields'] as $field){
                    $listFields[] = array('name'=>$field);
                }

                $contextMenu[] = array(
                    'name'=>$table,
                    'fields'=>$listFields
                );
            }

            $response['tables'] = $tables;
            break;
    }
    header('Content-type: application/json');
    echo json_encode($response);
}

