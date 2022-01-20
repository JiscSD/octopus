import type { NextPage } from 'next';
import Head from 'next/head';

import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Components from '@components';

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.home.description} />
                <meta name="keywords" content={Config.urls.home.keywords} />
                <link rel="canonical" href={Config.urls.home.canonical} />
                <title>{Config.urls.home.title}</title>
            </Head>
            <Layouts.Standard>
                <Components.Section
                    id="home-search"
                    className="bg-purple-100 dark:bg-grey-600"
                    wave={true}
                    waveFill="fill-purple-100 dark:fill-grey-600"
                >
                    <div className="container mx-auto px-8">
                        <p>hello</p>
                    </div>
                </Components.Section>
                <Components.Section
                    id="another"
                    className="bg-peach-200 dark:bg-grey-700"
                    wave={true}
                    waveFill="fill-peach-200 dark:fill-grey-700"
                >
                    <div className="container mx-auto px-8">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis explicabo, velit
                            repellendus veritatis nisi aut iure delectus deleniti quam debitis, cumque sed cum dolorum
                            saepe error aperiam totam, quis autem? Odio ut sint fugit id quod itaque omnis commodi
                            debitis reprehenderit quisquam, deserunt optio voluptatum, ab reiciendis laudantium modi
                            dolores temporibus voluptas aperiam? Ullam, excepturi enim odit nisi consequuntur deserunt.
                            Expedita qui magnam vero consequatur magni delectus saepe fuga exercitationem quam veniam ab
                            cum ipsa maiores, ducimus amet rerum, quas officiis omnis corrupti recusandae impedit
                            distinctio debitis similique mollitia. Soluta! Quaerat numquam libero exercitationem
                            blanditiis perferendis in, explicabo quis fugiat atque voluptatum labore iure nemo eveniet
                            enim sed dolor expedita qui optio voluptates suscipit neque asperiores natus dolorum?
                            Aliquid, iure! Voluptatibus quisquam aspernatur temporibus velit? Fuga, in officiis
                            recusandae nobis ratione nisi quasi consectetur, velit natus, aperiam fugiat sed illo
                            accusantium consequuntur explicabo beatae voluptate? Fuga, porro totam. Dolores, quos.
                            Expedita vero in non placeat nihil error repudiandae quis itaque debitis, odit tempore
                            soluta assumenda velit provident mollitia. Temporibus saepe perferendis voluptatem autem,
                            laboriosam recusandae iste quod libero adipisci labore. Rerum, illum aliquid. Repellendus
                            eius, veritatis vitae error reiciendis nobis eveniet similique consectetur rerum vero.
                            Officiis laborum sunt asperiores consequatur! Beatae at cum animi. Labore dicta accusantium
                            architecto error aspernatur? Odit provident ab molestiae laudantium consectetur aperiam
                            atque non laborum molestias vel eveniet iusto enim quae, recusandae, dolores quaerat animi.
                            Maxime nesciunt voluptatum tempora modi natus, unde repudiandae adipisci vero. Laudantium
                            blanditiis incidunt libero, soluta laboriosam placeat totam rerum rem ipsam corporis, id est
                            molestiae quas veritatis sed aliquid mollitia vel! Necessitatibus cupiditate impedit
                            voluptatum porro, sequi provident laudantium nemo? Aspernatur molestias ipsa quisquam quam
                            reiciendis nobis possimus facilis atque magni quaerat, sequi molestiae eos id incidunt ea?
                            Vitae qui odio amet fuga, non voluptates molestias obcaecati quod dolor dolorem. Provident
                            modi quod dolore id quasi cumque doloremque. Pariatur aut facere et deserunt sed officia
                            eligendi, magnam veniam, fugit, iste dolore iure. Sint adipisci repudiandae debitis
                            perferendis modi suscipit eum? Et quia iste voluptatem corrupti nobis accusantium
                            reprehenderit quidem veritatis hic adipisci ullam cupiditate enim numquam eaque, saepe
                            laudantium maiores? Maxime eligendi libero neque exercitationem illo nesciunt reprehenderit
                            in enim. Similique et sit veniam maiores deleniti! Veritatis ab et blanditiis rem illo
                            asperiores adipisci ex aspernatur, harum modi similique ratione distinctio rerum in mollitia
                            quae laborum quas quam, debitis magni. Deleniti praesentium numquam culpa sunt quos illo
                            natus possimus. Iure saepe rerum cum ab harum voluptas alias, numquam soluta rem obcaecati
                            unde ipsa explicabo maiores laborum reiciendis in dignissimos natus? Rem aut voluptates
                            totam fugit maxime optio porro dolorum incidunt quas amet harum hic tempore vitae nesciunt,
                            eaque nihil esse. Optio veniam et quia accusamus reiciendis consequatur suscipit
                            dignissimos. Corporis. Molestiae, vitae aspernatur, eveniet laudantium tenetur sunt ducimus
                            alias blanditiis velit nostrum recusandae expedita eaque molestias optio nam, quod quisquam?
                            Hic vitae tempore ratione ipsa necessitatibus aliquam vel, reprehenderit quidem! Asperiores
                            odit rem incidunt consequatur accusantium laudantium? Nobis eius est facilis quisquam
                            aperiam natus. At dolorem, laboriosam error voluptatem dicta saepe placeat ex, natus omnis,
                            modi culpa corrupti facilis dolore. Assumenda consequatur itaque, nisi veniam velit dicta
                            quasi deserunt vero, magnam illo quas, exercitationem quidem. Inventore unde ipsum vitae
                            repudiandae expedita dolor ducimus explicabo. Harum consequuntur recusandae blanditiis
                            corrupti aut. Qui ipsa asperiores deleniti magni eius nostrum? Aliquam unde tempore, cum
                            nulla quae doloremque eum possimus rem minus officiis eaque magnam fugit, quis error dolor
                            tempora? Fuga id reiciendis sunt! Odio, quam! Libero error repudiandae placeat rerum modi
                            porro quibusdam cupiditate quis exercitationem, maiores incidunt aliquam, voluptate magni ex
                            optio dolor maxime veniam, enim dignissimos et tempore ad aliquid distinctio. Officia eum
                            eligendi ea dolores? Libero quia quo facilis consequatur cum dolor labore, architecto minus
                            doloremque debitis aut deserunt dicta amet consectetur voluptas, rem quos corporis
                            dignissimos, nisi assumenda similique? Ipsam iusto tempore reprehenderit debitis inventore
                            animi nobis quo quibusdam non dolorum, mollitia ut est soluta eos aliquid dicta aut facilis
                            iure quidem beatae eveniet architecto nihil maiores distinctio? Dolorum. Aspernatur fugiat
                            ullam dignissimos perferendis fuga qui sapiente enim cum ad, ab consequatur quam quo.
                            Maiores ad, ipsam aspernatur rerum sint qui hic ducimus. Quas odio numquam sunt incidunt
                            qui. Praesentium quisquam laudantium ratione minima ipsum. Delectus laboriosam accusamus
                            quibusdam facilis voluptas incidunt quidem harum assumenda obcaecati officia? Dignissimos
                            quisquam eum mollitia possimus aperiam recusandae illum delectus. Aliquid, illo laudantium!
                            Fugit animi tempora assumenda rerum minima tenetur esse eaque, architecto laborum quibusdam
                            repellendus nemo vel nostrum a iste quis itaque magnam! Delectus veritatis suscipit nostrum
                            incidunt recusandae reprehenderit facilis necessitatibus. Minima iure laudantium provident
                            dolore accusantium adipisci, minus consectetur, magnam assumenda optio error vel eos
                            repudiandae. Maxime quia porro, non dolores illo ea deserunt eos odio soluta, sed veritatis
                            eius. Voluptate recusandae quasi libero consequatur nostrum repellat est autem. Nemo,
                            laudantium deserunt aperiam alias quo porro itaque cupiditate, officia corporis ipsam, nobis
                            consequatur distinctio ad sed iusto quas molestias voluptates. Animi molestias commodi eius
                            incidunt illo soluta error laudantium ratione! Exercitationem, laudantium aliquid amet
                            perspiciatis totam vero harum repellendus omnis illo quaerat voluptatem, doloribus
                            doloremque iusto dolore consequatur. Quam, fugiat. Voluptas, error praesentium ut omnis
                            pariatur ex eaque fugiat facilis eum vel sit exercitationem aliquam maiores recusandae
                            excepturi labore quas necessitatibus optio dolorem officia et. Repellendus non corrupti
                            laborum error? Illo porro ratione labore pariatur commodi vitae quasi placeat nostrum odit
                            alias. Amet, ut laboriosam minima nulla minus deleniti eius! Harum consequuntur cum
                            explicabo optio necessitatibus, nulla modi itaque labore. Ducimus in culpa maxime, eius quae
                            laudantium dolorem sint officiis quidem ullam rem ea autem quas. Incidunt eaque eos amet
                            voluptatibus? Eligendi similique magnam exercitationem, saepe iusto aliquid enim rerum?
                            Ullam itaque neque ratione laudantium quos. A incidunt odit officiis nostrum officia culpa,
                            excepturi dolores eveniet placeat praesentium molestiae ut, eos eius. Nemo tempora corporis
                            est nulla magni vitae expedita. Quasi, odit expedita. Recusandae necessitatibus facilis fuga
                            tenetur hic animi corporis quaerat harum ipsa, similique quis laudantium! Illum, commodi
                            recusandae, voluptatibus eos officia ratione officiis dolores eius, accusamus ullam sunt?
                            Deserunt sunt vitae eos at iste, aliquam eveniet exercitationem illo eum enim mollitia culpa
                            deleniti architecto nemo natus nam numquam assumenda molestiae rem cum reprehenderit ad est!
                            Ipsum, quos neque! Reiciendis totam vel minus aperiam similique, ducimus tempore
                            voluptatibus officia dolor perferendis optio sed hic recusandae quos, explicabo
                            exercitationem, culpa tenetur omnis accusantium nam soluta? Fugiat error doloremque saepe
                            asperiores? Repellat a distinctio accusamus nesciunt fugiat iusto consequuntur temporibus
                            earum mollitia quas consequatur nam porro dolorem eligendi rerum tempora hic molestiae
                            cumque dicta sapiente iste, corporis voluptates tenetur error! Sapiente. Explicabo amet
                            quidem nihil, voluptatem exercitationem maxime quis sint laboriosam incidunt corrupti
                            praesentium quaerat molestias placeat ipsa distinctio. Fuga soluta eum nostrum aliquid
                            quasi! Velit aspernatur odio omnis repudiandae iste? Libero ut eveniet facilis accusantium
                            fugit nihil, minus aliquam fugiat aut, vitae excepturi amet sint sunt debitis voluptatem!
                            Ipsa accusantium odit nostrum mollitia nesciunt nisi vel, quos labore beatae quisquam!
                            Officiis tempora nemo aliquid aliquam laboriosam modi non necessitatibus possimus fugit
                            provident, molestias nulla natus? Quos, repellat. Itaque quas officiis dolore laudantium
                            hic, ea eos perferendis veniam, aperiam praesentium esse. Minus nulla culpa commodi aperiam
                            velit soluta sapiente facilis dolorum sunt perspiciatis ea omnis ex, consectetur,
                            repellendus praesentium sed ipsa, eveniet ut quidem harum. Inventore ut tempore voluptatem
                            vitae numquam.
                        </p>
                    </div>
                </Components.Section>
            </Layouts.Standard>
        </>
    );
};

export default Home;
